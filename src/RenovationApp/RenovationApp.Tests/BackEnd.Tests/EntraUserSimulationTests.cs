using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;
using RenovationApp.Server.Controllers;
using System.Security.Claims;

namespace RenovationApp.Tests
{
    public class ModelEntraUserSimulationTests
    {
        [Fact]
        public async Task GetUserProfile_AuthenticatedAsTestUser_ReturnsOk()
        {
            // Arrange
            var claims = new[]
            {
                new Claim("http://schemas.microsoft.com/identity/claims/objectidentifier", "test-user-guid")
            };

            var identity = new ClaimsIdentity(claims, "Test");
            var user = new ClaimsPrincipal(identity);

            var controller = new AccountController(new MockUserService()); // Replace with real or mocked service
            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = user }
            };

            // Act
            var result = controller.GetProfile(); // Example method

            // Assert
            Assert.IsType<OkObjectResult>(result);
        }
    }

    // Dummy service and controller for illustration
    public class MockUserService : IUserService
    {
        public object GetProfile(string oid) => new { Name = "Test User", Oid = oid };
    }

    public interface IUserService
    {
        object GetProfile(string oid);
    }

    public class AccountController : ControllerBase
    {
        private readonly IUserService _userService;

        public AccountController(IUserService userService)
        {
            _userService = userService;
        }

        [Authorize]
        [HttpGet("/api/account/profile")]
        public IActionResult GetProfile()
        {
            var oid = User.FindFirstValue("http://schemas.microsoft.com/identity/claims/objectidentifier");
            var profile = _userService.GetProfile(oid);
            return Ok(profile);
        }
    }
}