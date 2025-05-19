using Microsoft.AspNetCore.Mvc;
using RenovationApp.Server.Models;
using RenovationApp.Server.Services;
using RenovationApp.Server.Services.Fileservice.Dtos;
using RenovationApp.Server.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Build.Framework;
using static RenovationApp.Server.Dtos.RFQImageDTOs;

namespace RenovationApp.Server.Controllers
{
    [ApiController]
    [Route("rfq/{rfqId}/images")]
    [Authorize]
    public class RFQImageController : ControllerBase
    {
        private readonly IStorageService _storageService;
        private readonly ApplicationDbContext _db;
        private readonly string _rfqBucket;

        public RFQImageController(IStorageService storageService, ApplicationDbContext db, IConfiguration config)
        {
            _storageService = storageService;
            _db = db;
            _rfqBucket = config["MINIO_RFQ_BUCKET"] ?? throw new ArgumentNullException("MINIO_RFQ_BUCKET");
        }

        [HttpPost("upload-url")]
        public async Task<IActionResult> GetUploadUrl(int rfqId, [FromBody] UploadRFQImageRequestDto dto)
        {
            // Check if the RFQ exists
            var rfq = await _db.RFQs.FindAsync(rfqId);
            if (rfq == null)
            {
                return NotFound("RFQ not found.");
            }

            // Check user authorization
            if (!IsAuthorizedForRFQ(rfq))
            {
                return Unauthorized("You are not authorized to upload files to this RFQ.");
            }

            var expiry = TimeSpan.FromMinutes(10);
            var result = await _storageService.GeneratePresignedUploadUrlAsync(_rfqBucket, "image", rfqId, dto.FileName, expiry);

            var image = new RFQImage
            {
                RFQId = rfqId,
                ImageUri = result.ObjectKey,
                UploadedAt = DateTime.UtcNow,
                FileName = dto.FileName
            };

            _db.RFQImages.Add(image);
            await _db.SaveChangesAsync();

            return Ok(new { url = result.Url, key = result.ObjectKey });
        }

        [HttpGet]
        public async Task<ActionResult<List<GetImageDTOs>>> GetImages(int rfqId)
        {
            // Check if the RFQ exists
            var rfq = await _db.RFQs.FindAsync(rfqId);
            if (rfq == null)
            {
                return NotFound("RFQ not found.");
            }

            // Check user authorization
            if (!IsAuthorizedForRFQ(rfq))
            {
                return Unauthorized("You are not authorized to access files for this RFQ.");
            }

            var query = _db.RFQImages.Where(f => f.RFQId == rfqId);
            var images = await query.ToListAsync();

            var result = new List<GetImageDTOs>();
            foreach (var image in images)
            {
                bool fileExists = true; // Replace with actual file existence check if needed
                if (fileExists)
                {
                    var url = await _storageService.GeneratePresignedDownloadUrlAsync(_rfqBucket, image.ImageUri);
                    var resultDto = new GetImageDTOs
                    {
                        Id = image.Id,
                        FileName = image.FileName,
                        UploadedAt = image.UploadedAt,
                        ImageUri = url
                    };
                    result.Add(resultDto);
                }
                else
                {
                    _db.RFQImages.Remove(image);
                }
            }

            await _db.SaveChangesAsync();
            return Ok(result);
        }

        private bool IsAuthorizedForRFQ(RFQ rfq)
        {
            var userId = User.Claims.FirstOrDefault(c => c.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return false;
            }

            if (User.IsInRole("projectManager"))
            {
                return true;
            }

            return rfq.ClientId == userId;
        }
    }
}
