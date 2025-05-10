using RenovationApp.Server.Services.Fileservice.Dtos;

namespace RenovationApp.Server.Services
{
    public interface IStorageService
    {
        Task<PresignedUploadResult> GeneratePresignedUploadUrlAsync(string bucketName, string fileType, int projectId, string fileName, TimeSpan expiry);
        Task<string> GeneratePresignedDownloadUrlAsync(string bucketName, string objectKey);
        Task<bool> ObjectExistsAsync(string bucketName, string objectKey);
    }
}
