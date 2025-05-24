using Microsoft.EntityFrameworkCore;
using RenovationApp.Server.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Identity.Web;
using Microsoft.OpenApi.Models;
using RenovationApp.Server.Services;
using System.Text.Json.Serialization;


var builder = WebApplication.CreateBuilder(args);

var host = builder.Configuration["POSTGRES_HOST"];
var port = builder.Configuration["POSTGRES_PORT"];
var database = builder.Configuration["POSTGRES_DATABASE"];
var username = builder.Configuration["POSTGRES_USERNAME"];
var password = builder.Configuration["POSTGRES_PASSWORD"];

var connectionString = $"Host={host};Port={port};Database={database};Username={username};Password={password}";
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

var config = builder.Configuration;

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString));
// Add services to the container.
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddMicrosoftIdentityWebApi(builder.Configuration, "AzureAd");
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("projectManagersOnly", policy =>
    {
        policy.RequireAuthenticatedUser();
        policy.RequireRole("projectmanager");
    });
});

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy =>
                      {
                          policy.WithOrigins("*").AllowAnyHeader()
                                                  .AllowAnyMethod();
                      });
});

builder.Services.AddControllers().AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1",
        new OpenApiInfo
        {
            Title = "Renovation Station Backend API",
            Version = "v1",
            Description = "The API for the Renovation Station Application",
            TermsOfService = new Uri("https://example.com/terms"),
        });

    // Set the comments path for the Swagger JSON and UI.
    //var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    //var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    //c.IncludeXmlComments(xmlPath);

    // Enabled OAuth security in Swagger
    var scopes = new Dictionary<string, string>()
    { };
    scopes.Add($"{builder.Configuration["ApiScopeUrl"]}user_impersonation", "Access application on user behalf");
    c.AddSecurityRequirement(new OpenApiSecurityRequirement() {
        {
            new OpenApiSecurityScheme {
                Reference = new OpenApiReference {
                    Type = ReferenceType.SecurityScheme,
                    Id = "oauth2"
                },
                Scheme = "oauth2",
                Name = "oauth2",
                In = ParameterLocation.Header
            },
            new List<string> { $"{builder.Configuration["ApiScopeUrl"]}user_impersonation" }
        }
    });
    c.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
    {
        Type = SecuritySchemeType.OAuth2,
        Flows = new OpenApiOAuthFlows
        {
            Implicit = new OpenApiOAuthFlow()
            {
                AuthorizationUrl = new Uri("https://renovationstationexsm3943.ciamlogin.com/e90f24c7-0844-464a-a0b1-aab345a6adff/oauth2/v2.0/authorize"),
                //TokenUrl = new Uri("https://renovationstationexsm3943.ciamlogin.com/e90f24c7-0844-464a-a0b1-aab345a6adff/oauth2/v2.0/token"),
                Scopes = scopes
            }
        }
    });
});

builder.Services.AddScoped<MinioStorageService>();
builder.Services.AddScoped<IStorageService, MinioStorageService>();

var app = builder.Build();

app.Logger.LogInformation($"PostgreSQL Connection String: {connectionString}");

// --- Run Entity Framework migrations automatically ---
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    try
    {
        app.Logger.LogInformation("Applying database migrations...");
        dbContext.Database.Migrate();
        app.Logger.LogInformation("Database migrations applied successfully.");
    }
    catch (Exception ex)
    {
        app.Logger.LogError(ex, "An error occurred while applying database migrations.");
        throw; // Re-throw to prevent the application from starting with an invalid database state
    }
}

// --- Ensure S3 buckets exist before starting the app ---
using (var scope = app.Services.CreateScope())
{
    var minioStorage = scope.ServiceProvider.GetService<IStorageService>() as MinioStorageService;
    if (minioStorage != null)
    {
        minioStorage.EnsureBucketExistsAsync(minioStorage.RFQBucket).GetAwaiter().GetResult();
        minioStorage.EnsureBucketExistsAsync(minioStorage.ProjectBucket).GetAwaiter().GetResult();
    }
    else
    {
        app.Logger.LogError("MinioStorageService could not be resolved. Ensure it is registered correctly.");
    }
}
// -------------------------------------------------------
app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.OAuthClientId(builder.Configuration["AzureAd:ClientId"]);
    });
}

app.UseHttpsRedirection();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.UseCors(MyAllowSpecificOrigins);

app.MapFallbackToFile("/index.html");

app.Run();

public partial class Program { }