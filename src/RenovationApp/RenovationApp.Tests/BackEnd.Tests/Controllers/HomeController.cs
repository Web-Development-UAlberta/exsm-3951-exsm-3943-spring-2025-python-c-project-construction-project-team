using Xunit;
using YourApp.Controllers;
using Microsoft.AspNetCore.Mvc;

public class HomeControllerTests
{
    [Fact]
    public void Index_ReturnsViewResult()
    {
        // Arrange
        var controller = new HomeController();

        // Act
        var result = controller.Index();

        // Assert
        Assert.IsType<ViewResult>(result);
    }
}