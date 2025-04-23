using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Web.Resource;

namespace RenovationApp.Server.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    [Authorize]
    public class WeatherForecastController : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        private readonly ILogger<WeatherForecastController> _logger;

        public WeatherForecastController(ILogger<WeatherForecastController> logger)
        {
            _logger = logger;
        }
        [RequiredScope("user_impersonation")]
        [HttpGet(Name = "GetWeatherForecast")]
        public IEnumerable<WeatherForecast> Get()
        {
            return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
                TemperatureC = Random.Shared.Next(-20, 55),
                Summary = Summaries[Random.Shared.Next(Summaries.Length)]
            })
            .ToArray();
        }
    }

    [ApiController]
    [Route("/api/[controller]")]
    [Authorize(Policy = "SecretAgentsOnly")]
    public class RBACWeatherForecastController : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        private readonly ILogger<RBACWeatherForecastController> _logger;

        public RBACWeatherForecastController(ILogger<RBACWeatherForecastController> logger)
        {
            _logger = logger;
        }
        [RequiredScope("user_impersonation")]
        [HttpGet(Name = "GetSecretWeatherForecast")]
        public IEnumerable<SecretWeatherForecast> Get()
        {
            return Enumerable.Range(1, 5).Select(index => new SecretWeatherForecast
            {
                SecretLevel="Super duper secret",
                Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
                TemperatureC = Random.Shared.Next(-20, 55),
                Summary = Summaries[Random.Shared.Next(Summaries.Length)]
            })
            .ToArray();
        }
    }
}
