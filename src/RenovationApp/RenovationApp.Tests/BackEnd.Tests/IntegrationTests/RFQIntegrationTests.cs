using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Testing;
using RenovationApp.Server.Models;
using Xunit;

public class RFQIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public RFQIntegrationTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task PostRFQ_ValidRequest_ReturnsCreated()
    {
        // Arrange
        var rfq = new
        {
            ClientId = 1,
            AssignedEmployeeId = 2,
            Status = "Created",
            PreferredMaterial = "Steel",
            Description = "Garage expansion",
            RenovationType = "KitchenRemodels",
            Budget = 18000,
            ProjectAddress = "1010 Birch Street",
            RoomSize = "Large"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/rfq", rfq);

        // Assert
        Assert.Equal(System.Net.HttpStatusCode.Created, response.StatusCode);
    }

    [Fact]
    public async Task PostRFQ_InvalidBudget_ReturnsBadRequest()
    {
        // Arrange
        var rfq = new
        {
            ClientId = 1,
            AssignedEmployeeId = 2,
            Status = "Created",
            PreferredMaterial = "Steel",
            Description = "Invalid budget test",
            RenovationType = "KitchenRemodels",
            Budget = -1000,
            ProjectAddress = "404 Test Ave",
            RoomSize = "Medium"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/rfq", rfq);

        // Assert
        Assert.Equal(System.Net.HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
public async Task PostRFQ_MissingRequiredFields_ReturnsBadRequest()
{
    // Arrange: Missing ClientId and Description
    var rfq = new
    {
        AssignedEmployeeId = 2,
        Status = "Created",
        PreferredMaterial = "Wood",
        RenovationType = "BathroomRenovations",
        Budget = 5000,
        ProjectAddress = "22 Test Lane",
        RoomSize = "Medium"
    };

    // Act
    var response = await _client.PostAsJsonAsync("/api/rfq", rfq);

    // Assert
    Assert.Equal(System.Net.HttpStatusCode.BadRequest, response.StatusCode);
}

[Fact]
public async Task PostRFQ_InvalidRoomSize_ReturnsBadRequest()
{
    // Arrange: Invalid RoomSize value
    var rfq = new
    {
        ClientId = 1,
        AssignedEmployeeId = 2,
        Status = "Created",
        PreferredMaterial = "Wood",
        Description = "Invalid room size test",
        RenovationType = "HomeAdditions",
        Budget = 7000,
        ProjectAddress = "123 Invalid Lane",
        RoomSize = "Enormous" // invalid
    };

    // Act
    var response = await _client.PostAsJsonAsync("/api/rfq", rfq);

    // Assert
    Assert.Equal(System.Net.HttpStatusCode.BadRequest, response.StatusCode);
}

[Fact]
public async Task PostRFQ_BudgetAtZero_ReturnsBadRequest()
{
    // Arrange: Budget = 0 (assume invalid)
    var rfq = new
    {
        ClientId = 1,
        AssignedEmployeeId = 2,
        Status = "Created",
        PreferredMaterial = "Glass",
        Description = "Budget edge case",
        RenovationType = "BasementFinishing",
        Budget = 0,
        ProjectAddress = "888 Budget Blvd",
        RoomSize = "Small"
    };

    // Act
    var response = await _client.PostAsJsonAsync("/api/rfq", rfq);

    // Assert
    Assert.Equal(System.Net.HttpStatusCode.BadRequest, response.StatusCode);
}

}