using RenovationApp.Server.Services.Fileservice.Dtos;

namespace RenovationApp.Server.Services
{
    public interface IStorageService
    {
        PresignedUploadResult GeneratePresignedUploadUrl(string bucketName, string fileType, int projectId, string fileName, TimeSpan expiry);
        string GeneratePresignedDownloadUrl(string bucketName, string objectKey);
        Task<bool> ObjectExistsAsync(string bucketName, string objectKey);
    }
}
