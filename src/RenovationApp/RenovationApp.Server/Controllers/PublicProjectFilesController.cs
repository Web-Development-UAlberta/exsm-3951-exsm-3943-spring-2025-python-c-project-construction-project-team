using Microsoft.AspNetCore.Mvc;
using RenovationApp.Server.Data;
using RenovationApp.Server.Services;
using RenovationApp.Server.Models;
using RenovationApp.Server.Services.Fileservice.Dtos;
using Microsoft.EntityFrameworkCore;

namespace RenovationApp.Server.Controllers
{
    [ApiController]
    [Route("/Public/Project/{projectId}/files")]
    public class PublicProjectFilesController : ControllerBase
    {
        private readonly IStorageService _storageService;
        private readonly ApplicationDbContext _db;
        private readonly string _projectBucket;

        public PublicProjectFilesController(IStorageService storageService, ApplicationDbContext db, IConfiguration config)
        {
            _storageService = storageService;
            _db = db;
            _projectBucket = config["MINIO_PROJECT_BUCKET"] ?? throw new ArgumentNullException("MINIO_PROJECT_BUCKET");
        }

        [HttpGet("public-images")]
        public async Task<IActionResult> GetPublicImages(int projectId)
        {
            // Check if the project exists and is public
            var project = await _db.Projects
                .Include(p => p.Files)
                .FirstOrDefaultAsync(p => p.Id == projectId && p.IsPublic);

            if (project == null)
            {
                return NotFound("Project not found or is not public.");
            }

            if (project.Files == null || !project.Files.Any())
            {
                return NotFound("No files found for this project.");
            }

            // Filter files to include only images
            var imageFiles = project.Files
                .Where(f => f.Type == FileType.image)
                .ToList();

            var result = new List<FileDownloadDto>();

            foreach (var file in imageFiles)
            {
                var url = await _storageService.GeneratePresignedDownloadUrlAsync(_projectBucket, file.FileUri);
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
