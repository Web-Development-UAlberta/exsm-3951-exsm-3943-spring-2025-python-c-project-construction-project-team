using RenovationApp.Server.Dtos;

namespace RenovationApp.Server.Services
{
    public interface IStorageService
    {
        Task<PresignedUploadResult> GeneratePresignedUploadUrlAsync(string fileType, string projectId, string fileName, TimeSpan expiry);
        Task<string> GeneratePresignedDownloadUrlAsync(string objectKey); // Updated to return a single URL
    }
}
