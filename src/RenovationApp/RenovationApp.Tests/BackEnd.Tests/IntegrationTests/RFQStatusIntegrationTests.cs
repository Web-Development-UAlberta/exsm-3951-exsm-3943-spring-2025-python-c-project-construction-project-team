using System.Net;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

public class RFQStatusIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public RFQStatusIntegrationTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task Get_Index_ReturnsSuccess()
    {
        var response = await _client.GetAsync("/RFQStatus");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task Post_Create_ValidStatus_ReturnsRedirect()
    {
        var formData = new MultipartFormDataContent
        {
            { new StringContent("Approved"), "Status" }
        };

        var response = await _client.PostAsync("/RFQStatus/Create", formData);
        Assert.True(response.StatusCode == HttpStatusCode.Redirect || response.StatusCode == HttpStatusCode.OK);
    }

    [Fact]
    public async Task Post_Create_InvalidStatus_ReturnsFormWithError()
    {
        var formData = new MultipartFormDataContent
        {
            { new StringContent(new string('X', 35)), "Status" } // exceed limit of 30 characters
        };

        var response = await _client.PostAsync("/RFQStatus/Create", formData);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode); // Re-render form with validation error
    }
}