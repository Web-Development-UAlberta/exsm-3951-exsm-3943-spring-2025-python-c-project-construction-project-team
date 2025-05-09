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
        var rfq = new
        {
            ClientId = 1,
            AssignedEmployeeId = 2,
            Status = "Pending",
            PreferredMaterial = "Steel",
            Description = "Garage expansion",
            RenovationType = "Kitchen",
            Budget = 18000,
            ProjectAddress = "1010 Birch Street",
            RoomSize = "Large"
        };

        var response = await _client.PostAsJsonAsync("/api/rfq", rfq);

        Assert.Equal(System.Net.HttpStatusCode.Created, response.StatusCode);
    }

    [Fact]
    public async Task PostRFQ_InvalidBudget_ReturnsBadRequest()
    {
        var rfq = new
        {
            ClientId = 1,
            AssignedEmployeeId = 2,
            Status = "Pending",
            PreferredMaterial = "Steel",
            Description = "Invalid budget test",
            RenovationType = "Kitchen",
            Budget = -1000,
            ProjectAddress = "404 Test Ave",
            RoomSize = "Medium"
        };

        var response = await _client.PostAsJsonAsync("/api/rfq", rfq);

        Assert.Equal(System.Net.HttpStatusCode.BadRequest, response.StatusCode);
    }
}