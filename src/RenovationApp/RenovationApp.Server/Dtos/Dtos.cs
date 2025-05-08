namespace RenovationApp.Server.Dtos
{
    public class FileDownloadDto
    {
        required public string FileName { get; set; }
        public string? Description { get; set; }
        required public string FileType { get; set; }
        required public string Url { get; set; }
    }

    public class UploadFileRequestDto
    {
        required public string ProjectId { get; set; }
        required public string FileType { get; set; } // "image" or "file"
        required public string FileName { get; set; }
        public string? Description { get; set; }
    }
    public class PresignedUploadResult
    {
        public string? Url { get; set; }
        public string? ObjectKey { get; set; }
    }
}
