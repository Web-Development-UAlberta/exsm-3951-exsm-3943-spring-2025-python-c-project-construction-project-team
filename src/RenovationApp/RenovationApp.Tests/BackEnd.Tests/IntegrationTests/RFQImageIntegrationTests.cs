using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;
using RenovationApp.Server;

public class RFQImageIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public RFQImageIntegrationTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            AllowAutoRedirect = false
        });

        _client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Test");
    }

    [Fact]
    public async Task Upload_ValidImage_ReturnsCreated()
    {
        var content = new MultipartFormDataContent();
        var imageContent = new ByteArrayContent(new byte[1024 * 1024]); // 1MB dummy file
        imageContent.Headers.ContentType = MediaTypeHeaderValue.Parse("image/jpeg");
        content.Add(imageContent, "file", "test.jpg");
        content.Add(new StringContent("1"), "rfqId");

        var response = await _client.PostAsync("/api/rfq/image", content);
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
    }

    [Fact]
    public async Task Upload_FileTooLarge_ReturnsBadRequest()
    {
        var content = new MultipartFormDataContent();
        var imageContent = new ByteArrayContent(new byte[11 * 1024 * 1024]); // 11MB
        imageContent.Headers.ContentType = MediaTypeHeaderValue.Parse("image/jpeg");
        content.Add(imageContent, "file", "large.jpg");
        content.Add(new StringContent("1"), "rfqId");

        var response = await _client.PostAsync("/api/rfq/image", content);
        Assert.True(
            response.StatusCode == HttpStatusCode.BadRequest || response.StatusCode == HttpStatusCode.RequestEntityTooLarge,
            "Expected 400 Bad Request or 413 Payload Too Large");
    }

    [Fact]
    public async Task Upload_InvalidFileType_ReturnsBadRequest()
    {
        var content = new MultipartFormDataContent();
        var fileContent = new ByteArrayContent(new byte[1024]);
        fileContent.Headers.ContentType = MediaTypeHeaderValue.Parse("application/octet-stream");
        content.Add(fileContent, "file", "malicious.exe");
        content.Add(new StringContent("1"), "rfqId");

        var response = await _client.PostAsync("/api/rfq/image", content);
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }
}