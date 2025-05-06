using Microsoft.AspNetCore.Mvc;
using RenovationApp.Server.Models;
using RenovationApp.Server.Services;
using RenovationApp.Server.Dtos;
using RenovationApp.Server.Data;
using Microsoft.EntityFrameworkCore;

namespace RenovationApp.Server.Controllers
{
    [ApiController]
    [Route("/[controller]")]
    public class FilesController : ControllerBase
    {
        private readonly IStorageService _storageService;
        private readonly ApplicationDbContext _db;

        public FilesController(IStorageService storageService, ApplicationDbContext db)
        {
            _storageService = storageService;
            _db = db;
        }

        [HttpPost("upload-url")]
        public async Task<IActionResult> GetUploadUrl([FromBody] UploadFileRequestDto dto)
        {
            var expiry = TimeSpan.FromMinutes(10);

            var result = await _storageService.GeneratePresignedUploadUrlAsync(dto.FileType, dto.ProjectId, dto.FileName, expiry);

            var file = new ProjectFile
            {
                ProjectId = dto.ProjectId,
                FileType = dto.FileType,
                FileName = dto.FileName,
                Description = dto.Description,
                StorageKey = result.ObjectKey,
                UploadedTimestamp = DateTime.UtcNow
            };

            _db.ProjectFiles.Add(file);
            await _db.SaveChangesAsync();

            return Ok(new { url = result.Url, key = result.ObjectKey });
        }

        [HttpGet("{projectId}/files")]
        public async Task<IActionResult> GetFiles(string projectId, [FromQuery] string? fileType = null)
        {
            var query = _db.ProjectFiles.Where(f => f.ProjectId == projectId);

            if (!string.IsNullOrEmpty(fileType))
                query = query.Where(f => f.FileType == fileType);

            var files = await query.ToListAsync();

            var result = new List<FileDownloadDto>();

            foreach (var file in files)
            {
                var url = await _storageService.GeneratePresignedDownloadUrlAsync(file.StorageKey); // Updated to call the modified method
                result.Add(new FileDownloadDto
                {
                    FileName = file.FileName,
                    Description = file.Description,
                    FileType = file.FileType,
                    Url = url
                });
            }

            return Ok(result);
        }
    }
}
