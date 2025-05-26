using RenovationApp.Server.Models;

namespace RenovationApp.Server.Services.Fileservice.Dtos
{
    public class FileDownloadDto
    {
        required public string FileName { get; set; }
        required public string FileType { get; set; }
        required public string Url { get; set; }
    }
    public class RFQDownloadDto
    {
        required public string Url { get; set; }
    }
    public class UploadProjectFileRequestDto
    {
        required public string FileType { get; set; } // "image" or "file"
        required public string FileName { get; set; }
    }
    public class UploadRFQImageRequestDto
    {
        required public string FileName { get; set; }
    }
    public class PresignedUploadResult
    {
        required public string Url { get; set; }
        required public string ObjectKey { get; set; }
    }
}
