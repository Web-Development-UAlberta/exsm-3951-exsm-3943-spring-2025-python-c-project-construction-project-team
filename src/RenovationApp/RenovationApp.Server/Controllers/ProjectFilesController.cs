using Microsoft.AspNetCore.Mvc;
using RenovationApp.Server.Models;
using RenovationApp.Server.Services;
using RenovationApp.Server.Services.Fileservice.Dtos;
using RenovationApp.Server.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace RenovationApp.Server.Controllers
{
    [ApiController]
    [Route("projects/{projectId}/files")] // Removed the leading slash
    [Authorize]
    // [Authorize(Policy = "projectManagerOnly")]
    public class ProjectFilesController : ControllerBase
    {
        private readonly IStorageService _storageService;
        private readonly ApplicationDbContext _db;
        private readonly string _projectBucket;

        public ProjectFilesController(IStorageService storageService, ApplicationDbContext db, IConfiguration config)
        {
            _storageService = storageService;
            _db = db;
            _projectBucket = config["MINIO_PROJECT_BUCKET"] ?? throw new ArgumentNullException("MINIO_PROJECT_BUCKET");
        }

        [HttpPost("upload-url")]
        public async Task<IActionResult> GetUploadUrl(int projectId, [FromBody] UploadProjectFileRequestDto dto)
        {

            // Check if the project exists
            var project = await _db.Projects.FindAsync(projectId);
            if (project == null)
            {
                return NotFound("Project not found.");
            }

            // Get the user's role and ID
            var userId = User.Claims.FirstOrDefault(c => c.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return BadRequest("User ID is required.");
            }

            // if (!User.IsInRole("projectManager"))
            // {
            //     // Check if the user is the client of the project
            //     if (project.ClientId.ToString() != userId)
            //     {
            //         return Unauthorized("You are not authorized to upload files to this project.");
            //     }
            // }

            var expiry = TimeSpan.FromMinutes(10);

            var result = _storageService.GeneratePresignedUploadUrl(_projectBucket, dto.FileType, projectId, dto.FileName, expiry);

            if (!Enum.TryParse<FileType>(dto.FileType, out var fileType))
            {
                return BadRequest("Invalid file type specified.");
            }

            var file = new ProjectFile
            {
                ProjectId = projectId,
                Type = fileType,
                FileName = dto.FileName,
                FileUri = result.ObjectKey,
                UploadedTimestamp = DateTime.UtcNow
            };

                _db.ProjectFiles.Add(file);
                await _db.SaveChangesAsync();
                return Ok(new { url = result.Url, key = result.ObjectKey });
         
        }
        
        [HttpGet]
        public async Task<IActionResult> GetFiles(int projectId, [FromQuery] string? fileType = null)
        {
            // Check if the project exists
            var project = await _db.Projects.FindAsync(projectId);
            if (project == null)
            {
                return NotFound("Project not found.");
            }

            // Get the user's role and ID
            var userId = User.Claims.FirstOrDefault(c => c.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")?.Value;
            var userRole = User.Claims.FirstOrDefault(c => c.Type == "role")?.Value;

            // if (string.IsNullOrEmpty(userId))
            // {
            //     return BadRequest("User ID is required.");
            // }

            // if (User.IsInRole("projectmanager"))
            // {
            //     // Allow access only if the user is the client of the project
            //     if (project.ClientId.ToString() != userId)
            //     {
            //         return Unauthorized("You are not authorized to access files for this project.");
            //     }
            // }

            var query = _db.ProjectFiles.Where(f => f.ProjectId == projectId);

            if (!string.IsNullOrEmpty(fileType))
            {
                if (!Enum.TryParse<FileType>(fileType, out var eFileType))
                    return BadRequest("Invalid file type specified.");
                query = query.Where(f => f.Type == eFileType);
            }
            var files = await query.ToListAsync();

            var result = new List<FileDownloadDto>();

            foreach (var file in files)
            {
                var url = _storageService.GeneratePresignedDownloadUrl(_projectBucket, file.FileUri);
                result.Add(new FileDownloadDto
                {
                    FileName = file.FileName,
                    FileType = file.Type.ToString(),
                    Url = url
                });
            }

            return Ok(result);
        }
    }
}