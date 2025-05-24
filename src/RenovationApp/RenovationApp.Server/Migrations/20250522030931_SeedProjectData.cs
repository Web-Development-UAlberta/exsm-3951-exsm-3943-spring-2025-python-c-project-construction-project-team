using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace RenovationApp.Server.Migrations
{
    /// <inheritdoc />
    public partial class SeedProjectData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AspNetRoles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUsers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    AuthenticationOid = table.Column<Guid>(type: "uuid", nullable: false),
                    created_timestamp = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    name = table.Column<string>(type: "varchar(255)", nullable: false),
                    address = table.Column<string>(type: "varchar(255)", nullable: false),
                    role = table.Column<string>(type: "varchar(50)", nullable: false),
                    UserName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    NormalizedUserName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    Email = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    NormalizedEmail = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(type: "boolean", nullable: false),
                    PasswordHash = table.Column<string>(type: "text", nullable: true),
                    SecurityStamp = table.Column<string>(type: "text", nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "text", nullable: true),
                    PhoneNumber = table.Column<string>(type: "text", nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(type: "boolean", nullable: false),
                    TwoFactorEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    LockoutEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    AccessFailedCount = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUsers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ProjectServiceTypes",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "varchar(100)", nullable: true),
                    description = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectServiceTypes", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "RenovationTags",
                columns: table => new
                {
                    id = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RenovationTags", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "RFQs",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    created_timestamp = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    client_id = table.Column<string>(type: "varchar(255)", nullable: false),
                    status = table.Column<string>(type: "text", nullable: false),
                    assigned_employee_id = table.Column<string>(type: "varchar(255)", nullable: true),
                    PreferredMaterial = table.Column<string>(type: "character varying(160)", maxLength: 160, nullable: true),
                    Description = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    renovation_type = table.Column<string>(type: "text", nullable: false),
                    budget = table.Column<decimal>(type: "numeric(9,2)", nullable: true),
                    ProjectAddress = table.Column<string>(type: "character varying(160)", maxLength: 160, nullable: true),
                    RoomSize = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RFQs", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetRoleClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    RoleId = table.Column<int>(type: "integer", nullable: false),
                    ClaimType = table.Column<string>(type: "text", nullable: true),
                    ClaimValue = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoleClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetRoleClaims_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    ClaimType = table.Column<string>(type: "text", nullable: true),
                    ClaimValue = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetUserClaims_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserLogins",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(type: "text", nullable: false),
                    ProviderKey = table.Column<string>(type: "text", nullable: false),
                    ProviderDisplayName = table.Column<string>(type: "text", nullable: true),
                    UserId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserLogins", x => new { x.LoginProvider, x.ProviderKey });
                    table.ForeignKey(
                        name: "FK_AspNetUserLogins_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserRoles",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    RoleId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserRoles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserTokens",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    LoginProvider = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Value = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserTokens", x => new { x.UserId, x.LoginProvider, x.Name });
                    table.ForeignKey(
                        name: "FK_AspNetUserTokens_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Projects",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    created_timestamp = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    created_by_employee = table.Column<string>(type: "varchar(255)", nullable: false),
                    client_id = table.Column<string>(type: "varchar(255)", nullable: false),
                    rfq_id = table.Column<int>(type: "int", nullable: true),
                    status = table.Column<string>(type: "text", nullable: true),
                    is_public = table.Column<bool>(type: "boolean", nullable: false),
                    quote_price_override = table.Column<decimal>(type: "numeric(10,2)", nullable: true),
                    quote_schedule_start_override = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    quote_schedule_end_override = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    renovation_type = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Projects", x => x.id);
                    table.ForeignKey(
                        name: "FK_Projects_RFQs_rfq_id",
                        column: x => x.rfq_id,
                        principalTable: "RFQs",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "RFQImages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    FileName = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    FilePath = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    UploadedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ImageUri = table.Column<string>(type: "text", nullable: false),
                    RFQId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RFQImages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RFQImages_RFQs_RFQId",
                        column: x => x.RFQId,
                        principalTable: "RFQs",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ClientInvoices",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    created_timestamp = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    description = table.Column<string>(type: "text", nullable: true),
                    payment_instructions = table.Column<string>(type: "text", nullable: true),
                    paid = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    amount = table.Column<decimal>(type: "decimal", nullable: true),
                    project_id = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClientInvoices", x => x.id);
                    table.ForeignKey(
                        name: "FK_ClientInvoices_Projects_project_id",
                        column: x => x.project_id,
                        principalTable: "Projects",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "ProjectComments",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    comment = table.Column<string>(type: "text", nullable: false),
                    created_timestamp = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    created_by_employee = table.Column<string>(type: "varchar(255)", nullable: false),
                    project_id = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectComments", x => x.id);
                    table.ForeignKey(
                        name: "FK_ProjectComments_Projects_project_id",
                        column: x => x.project_id,
                        principalTable: "Projects",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProjectCommunications",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    created_timestamp = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    message = table.Column<string>(type: "text", nullable: false),
                    project_id = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectCommunications", x => x.id);
                    table.ForeignKey(
                        name: "FK_ProjectCommunications_Projects_project_id",
                        column: x => x.project_id,
                        principalTable: "Projects",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProjectFiles",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    uploaded_timestamp = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    file_uri = table.Column<string>(type: "text", nullable: false),
                    file_name = table.Column<string>(type: "text", nullable: false),
                    type = table.Column<string>(type: "text", nullable: false),
                    project_id = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectFiles", x => x.id);
                    table.ForeignKey(
                        name: "FK_ProjectFiles_Projects_project_id",
                        column: x => x.project_id,
                        principalTable: "Projects",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProjectRenovationTags",
                columns: table => new
                {
                    ProjectId = table.Column<int>(type: "int", nullable: false),
                    RenovationTagsId = table.Column<string>(type: "varchar(255)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectRenovationTags", x => new { x.ProjectId, x.RenovationTagsId });
                    table.ForeignKey(
                        name: "FK_ProjectRenovationTags_Projects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "Projects",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProjectRenovationTags_RenovationTags_RenovationTagsId",
                        column: x => x.RenovationTagsId,
                        principalTable: "RenovationTags",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProjectServices",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    status = table.Column<string>(type: "text", nullable: true),
                    project_id = table.Column<int>(type: "int", nullable: false),
                    name = table.Column<string>(type: "varchar(255)", nullable: false),
                    description = table.Column<string>(type: "text", nullable: false),
                    project_service_type_id = table.Column<int>(type: "int", nullable: true),
                    price_quote = table.Column<decimal>(type: "numeric(10,2)", nullable: true),
                    cost_quote = table.Column<decimal>(type: "numeric(10,2)", nullable: true),
                    start_date_quote = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    end_date_quote = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    start_date_actual = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    end_date_actual = table.Column<DateTime>(type: "timestamp without time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectServices", x => x.id);
                    table.ForeignKey(
                        name: "FK_ProjectServices_ProjectServiceTypes_project_service_type_id",
                        column: x => x.project_service_type_id,
                        principalTable: "ProjectServiceTypes",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_ProjectServices_Projects_project_id",
                        column: x => x.project_id,
                        principalTable: "Projects",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProjectTasks",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    created_timestamp = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    project_id = table.Column<int>(type: "int", nullable: true),
                    user_id = table.Column<string>(type: "varchar(255)", nullable: true),
                    title = table.Column<string>(type: "text", maxLength: 100, nullable: true),
                    description = table.Column<string>(type: "text", nullable: true),
                    status = table.Column<string>(type: "text", maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectTasks", x => x.id);
                    table.ForeignKey(
                        name: "FK_ProjectTasks_Projects_project_id",
                        column: x => x.project_id,
                        principalTable: "Projects",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "ProjectServiceInvoices",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    created_timestamp = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    service_id = table.Column<int>(type: "int", nullable: false),
                    amount = table.Column<decimal>(type: "numeric(10,2)", nullable: false),
                    paid_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectServiceInvoices", x => x.id);
                    table.ForeignKey(
                        name: "FK_ProjectServiceInvoices_ProjectServices_service_id",
                        column: x => x.service_id,
                        principalTable: "ProjectServices",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Projects",
                columns: new[] { "id", "client_id", "created_by_employee", "created_timestamp", "is_public", "quote_price_override", "quote_schedule_end_override", "quote_schedule_start_override", "rfq_id", "renovation_type", "status" },
                values: new object[,]
                {
                    { 1, "2025-05-19T17:37:40.401185Z", "2caf9d13-45db-4960-8a81-a4ffb48dc8f3", new DateTime(2025, 5, 21, 0, 0, 0, 0, DateTimeKind.Utc), true, 15000.00m, null, null, null, "KitchenRemodels", null },
                    { 2, "2025-05-19T17:37:40.401185Z", "2caf9d13-45db-4960-8a81-a4ffb48dc8f3", new DateTime(2025, 5, 21, 0, 0, 0, 0, DateTimeKind.Utc), true, 9800.50m, null, null, null, "BathroomRenovations", null },
                    { 3, "2025-05-19T17:37:40.401185Z", "2caf9d13-45db-4960-8a81-a4ffb48dc8f3", new DateTime(2025, 5, 21, 0, 0, 0, 0, DateTimeKind.Utc), true, 20000.00m, null, null, null, "BasementFinishing", null },
                    { 4, "2025-05-19T17:37:40.401185Z", "2caf9d13-45db-4960-8a81-a4ffb48dc8f3", new DateTime(2025, 5, 21, 0, 0, 0, 0, DateTimeKind.Utc), true, 45000.00m, null, null, null, "HomeAdditions", null },
                    { 5, "2025-05-19T17:37:40.401185Z", "2caf9d13-45db-4960-8a81-a4ffb48dc8f3", new DateTime(2025, 5, 21, 0, 0, 0, 0, DateTimeKind.Utc), true, 12300.00m, null, null, null, "KitchenRemodels", null },
                    { 6, "2025-05-19T17:37:40.401185Z", "2caf9d13-45db-4960-8a81-a4ffb48dc8f3", new DateTime(2025, 5, 21, 0, 0, 0, 0, DateTimeKind.Utc), true, 8700.75m, null, null, null, "BathroomRenovations", null },
                    { 7, "2025-05-19T17:37:40.401185Z", "2caf9d13-45db-4960-8a81-a4ffb48dc8f3", new DateTime(2025, 5, 21, 0, 0, 0, 0, DateTimeKind.Utc), true, 17450.20m, null, null, null, "BasementFinishing", null },
                    { 8, "2025-05-19T17:37:40.401185Z", "2caf9d13-45db-4960-8a81-a4ffb48dc8f3", new DateTime(2025, 5, 21, 0, 0, 0, 0, DateTimeKind.Utc), true, 39999.99m, null, null, null, "HomeAdditions", null }
                });

            migrationBuilder.InsertData(
                table: "RenovationTags",
                column: "id",
                values: new object[]
                {
                    "Modern",
                    "Rustic",
                    "Sophisticated"
                });

            migrationBuilder.InsertData(
                table: "ProjectRenovationTags",
                columns: new[] { "ProjectId", "RenovationTagsId" },
                values: new object[,]
                {
                    { 1, "Modern" },
                    { 2, "Modern" },
                    { 2, "Rustic" },
                    { 3, "Rustic" },
                    { 3, "Sophisticated" },
                    { 4, "Modern" },
                    { 4, "Sophisticated" },
                    { 5, "Rustic" },
                    { 6, "Modern" },
                    { 6, "Rustic" },
                    { 6, "Sophisticated" },
                    { 7, "Sophisticated" },
                    { 8, "Modern" },
                    { 8, "Rustic" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_AspNetRoleClaims_RoleId",
                table: "AspNetRoleClaims",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                table: "AspNetRoles",
                column: "NormalizedName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserClaims_UserId",
                table: "AspNetUserClaims",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserLogins_UserId",
                table: "AspNetUserLogins",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserRoles_RoleId",
                table: "AspNetUserRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                table: "AspNetUsers",
                column: "NormalizedEmail");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                table: "AspNetUsers",
                column: "NormalizedUserName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ClientInvoices_project_id",
                table: "ClientInvoices",
                column: "project_id");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectComments_project_id",
                table: "ProjectComments",
                column: "project_id");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectCommunications_project_id",
                table: "ProjectCommunications",
                column: "project_id");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectFiles_project_id",
                table: "ProjectFiles",
                column: "project_id");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectRenovationTags_RenovationTagsId",
                table: "ProjectRenovationTags",
                column: "RenovationTagsId");

            migrationBuilder.CreateIndex(
                name: "IX_Projects_rfq_id",
                table: "Projects",
                column: "rfq_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProjectServiceInvoices_service_id",
                table: "ProjectServiceInvoices",
                column: "service_id");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectServices_project_id",
                table: "ProjectServices",
                column: "project_id");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectServices_project_service_type_id",
                table: "ProjectServices",
                column: "project_service_type_id");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectTasks_project_id",
                table: "ProjectTasks",
                column: "project_id");

            migrationBuilder.CreateIndex(
                name: "IX_RFQImages_RFQId",
                table: "RFQImages",
                column: "RFQId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AspNetRoleClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserLogins");

            migrationBuilder.DropTable(
                name: "AspNetUserRoles");

            migrationBuilder.DropTable(
                name: "AspNetUserTokens");

            migrationBuilder.DropTable(
                name: "ClientInvoices");

            migrationBuilder.DropTable(
                name: "ProjectComments");

            migrationBuilder.DropTable(
                name: "ProjectCommunications");

            migrationBuilder.DropTable(
                name: "ProjectFiles");

            migrationBuilder.DropTable(
                name: "ProjectRenovationTags");

            migrationBuilder.DropTable(
                name: "ProjectServiceInvoices");

            migrationBuilder.DropTable(
                name: "ProjectTasks");

            migrationBuilder.DropTable(
                name: "RFQImages");

            migrationBuilder.DropTable(
                name: "AspNetRoles");

            migrationBuilder.DropTable(
                name: "AspNetUsers");

            migrationBuilder.DropTable(
                name: "RenovationTags");

            migrationBuilder.DropTable(
                name: "ProjectServices");

            migrationBuilder.DropTable(
                name: "ProjectServiceTypes");

            migrationBuilder.DropTable(
                name: "Projects");

            migrationBuilder.DropTable(
                name: "RFQs");
        }
    }
}
