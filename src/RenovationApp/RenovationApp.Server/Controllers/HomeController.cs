using Microsoft.AspNetCore.Mvc;

namespace RenovationApp.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class HomeController : ControllerBase
    {
        [HttpGet]
        public IActionResult Index()
        {
            return Ok("Home controller stub.");
        }
    }
}