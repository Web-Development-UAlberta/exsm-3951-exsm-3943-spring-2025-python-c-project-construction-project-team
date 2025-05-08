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
    [Route("/[controller]")]
    public class RFQImageController : ControllerBase
    {
        private readonly IStorageService _storageService;
        private readonly ApplicationDbContext _db;
        private readonly string _projectBucket;

        public RFQImageController(IStorageService storageService, ApplicationDbContext db, IConfiguration config)
        {
            _storageService = storageService;
            _db = db;
            _projectBucket = config["MINIO_RFQ_BUCKET"] ?? throw new ArgumentNullException("MINIO_RFQ_BUCKET");
        }

        [HttpPost("upload-url")]
        public async Task<IActionResult> GetUploadUrl([FromBody] UploadRFQImageRequestDto dto)
        {
            // Check if the project exists
            var rfq = await _db.RFQs.FindAsync(dto.RFQId);
            if (rfq == null)
            {
                return NotFound("Project not found.");
            }

            // Get the user's role and ID
            var userId = User.Claims.FirstOrDefault(c => c.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return BadRequest("User ID is required.");
            }

            if (!User.IsInRole("projectManager"))
            {
                // Check if the user is the client of the project
                if (rfq.ClientId.ToString() != userId)
                {
                    return Unauthorized("You are not authorized to upload files to this RFQ.");
                }
            }

            var expiry = TimeSpan.FromMinutes(10);

            var result = await _storageService.GeneratePresignedUploadUrlAsync(_projectBucket, "image", dto.RFQId, dto.FileName, expiry);


            var image = new RFQImage
            {
                RFQId = dto.RFQId,
                ImageUri = result.ObjectKey,
                UploadedTimestamp = DateTime.UtcNow
            };

            _db.RFQImages.Add(image);
            await _db.SaveChangesAsync();

            return Ok(new { url = result.Url, key = result.ObjectKey });
        }

        [HttpGet("{rfqId}/images")]
        public async Task<IActionResult> GetImages(int rfqId)
        {
            // Check if the project exists
            var rfq = await _db.Projects.FindAsync(rfqId);
            if (rfq == null)
            {
                return NotFound("Project not found.");
            }

            // Get the user's role and ID
            var userId = User.Claims.FirstOrDefault(c => c.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")?.Value;
            var userRole = User.Claims.FirstOrDefault(c => c.Type == "role")?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                return BadRequest("User ID is required.");
            }

            if (User.IsInRole("projectmanager"))
            {
                // Allow access to all files for project managers
            }
            else if (User.IsInRole("client"))
            {
                // Allow access only if the user is the client of the project
                if (rfq.ClientId.ToString() != userId)
                {
                    return Unauthorized("You are not authorized to access files for this project.");
                }
            }

            var query = _db.RFQImages.Where(f => f.RFQId == rfqId);

            var images = await query.ToListAsync();

            var result = new List<RFQDownloadDto>();

            foreach (var image in images)
            {
                var url = await _storageService.GeneratePresignedDownloadUrlAsync(_projectBucket, image.ImageUri);
                result.Add(new RFQDownloadDto
                {
                    Url = url
                });
            }

            return Ok(result);
        }
    }
}
