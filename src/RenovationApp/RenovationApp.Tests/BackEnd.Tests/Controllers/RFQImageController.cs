using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RenovationApp.Server.Data;
using RenovationApp.Server.Models;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace RenovationApp.Server.Controllers
{
    [ApiController]
    [Route("api/rfq/image")]
    public class RFQImageController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly string[] permittedExtensions = { ".jpg", ".jpeg", ".png", ".pdf" };
        private const long MaxFileSize = 10 * 1024 * 1024; // 10 MB limit

        public RFQImageController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> UploadRFQImage([FromForm] IFormFile file, [FromForm] int rfqId)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            if (file.Length > MaxFileSize)
                return BadRequest("File exceeds the maximum allowed size of 10MB.");

            var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (string.IsNullOrEmpty(ext) || !permittedExtensions.Contains(ext))
                return BadRequest("Unsupported file type.");

            var uploadsFolder = Path.Combine("wwwroot", "uploads");
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            var filePath = Path.Combine(uploadsFolder, Guid.NewGuid() + ext);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var image = new RFQImage
            {
                RFQId = rfqId,
                UploadedTimestamp = DateTime.UtcNow,
                ImageUri = "/" + filePath.Replace("\", "/")
            };

            _context.RFQImages.Add(image);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(UploadRFQImage), new { id = image.Id }, image);
        }
    }
}