using Microsoft.AspNetCore.Mvc;
using RenovationApp.Server.Data;
using RenovationApp.Server.Services;
using RenovationApp.Server.Models;
using RenovationApp.Server.Services.Fileservice.Dtos;
using Microsoft.EntityFrameworkCore;
using static RenovationApp.Server.Dtos.ProjectDTOs;

namespace RenovationApp.Server.Controllers
{
    [ApiController]
    [Route("/projects-pub/")]
    public class PublicProjectController : ControllerBase
    {
        private readonly IStorageService _storageService;
        private readonly ApplicationDbContext _db;
        private readonly string _projectBucket;

        public PublicProjectController(IStorageService storageService, ApplicationDbContext db, IConfiguration config)
        {
            _storageService = storageService;
            _db = db;
            _projectBucket = config["MINIO_PROJECT_BUCKET"] ?? throw new ArgumentNullException("MINIO_PROJECT_BUCKET");
        }

        [HttpGet]
        public async Task<ActionResult<List<ProjectPublicInfo>>> GetProjectPublic()
        {
            // Check if the project exists and is public
            var projects = await _db.Projects.Include(p => p.ClientInvoices).Where(p => p.IsPublic).ToListAsync();

            var projectsOut = new List<ProjectPublicInfo>();

            foreach (var project in projects)
            {
                // Calculate CostCategory
                decimal costCategory;
                if (project.ClientInvoices != null && project.ClientInvoices.Any())
                {
                    costCategory = Math.Ceiling(project.ClientInvoices.Sum(i => i.Amount ?? 0) / 1000);
                }
                else if (project.QuotePriceOverride.HasValue)
                {
                    costCategory = Math.Ceiling(project.QuotePriceOverride.Value / 1000);
                }
                else
                {
                    costCategory = 0; // Default to 0 if no data is available
                }

                var publicProjectInfo = new ProjectPublicInfo
                {
                    Id = project.Id,
                    RenovationType = project.RenovationType,
                    CostCategory = costCategory,
                    RenovationTagIds = project.RenovationTags?.Select(t => t.Id).ToList()
                };
                // Add to the output list
                projectsOut.Add(publicProjectInfo);
            }

            return projectsOut;
        }

        [HttpGet("/projects-pub/{projectId}/public-images")]
        public async Task<ActionResult<List<FileDownloadDto>>> GetPublicImages(int projectId)
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
                var url = _storageService.GeneratePresignedDownloadUrl(_projectBucket, file.FileUri);
                result.Add(new FileDownloadDto
                {
                    FileName = file.FileName,
                    FileType = file.Type.ToString(),
                    Url = url
                });
            }

            return result;
        }
    }
}
