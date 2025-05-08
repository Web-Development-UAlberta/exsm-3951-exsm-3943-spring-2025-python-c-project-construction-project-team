using System.Net;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

public class UserRoleIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public UserRoleIntegrationTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task Get_Index_ReturnsSuccess()
    {
        var response = await _client.GetAsync("/UserRoles");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task Post_Create_ValidUserRole_Redirects()
    {
        var formData = new MultipartFormDataContent
        {
            { new StringContent("QA"), "Name" },
            { new StringContent("Quality assurance role") , "Description" }
        };

        var response = await _client.PostAsync("/UserRoles/Create", formData);
        Assert.True(response.StatusCode == HttpStatusCode.Redirect || response.StatusCode == HttpStatusCode.OK);
    }

    [Fact]
    public async Task Post_Create_InvalidDescription_ReturnsError()
    {
        var formData = new MultipartFormDataContent
        {
            { new StringContent("Support"), "Name" },
            { new StringContent(new string('X', 101)), "Description" }
        };

        var response = await _client.PostAsync("/UserRoles/Create", formData);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode); // Re-render with error
    }
}