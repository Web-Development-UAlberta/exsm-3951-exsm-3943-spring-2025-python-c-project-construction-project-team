using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RenovationApp.Server.Data;
using RenovationApp.Server.Models;

namespace RenovationApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class RFQImageController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public RFQImageController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/RFQImage
        [HttpGet]
        [Authorize(Roles = "Admin,ProjectManager")]
        public async Task<ActionResult<IEnumerable<RFQImage>>> GetRFQImages()
        {
            return await _context.RFQImages
                .Include(ri => ri.RFQ)
                .ToListAsync();
        }

        // GET: api/RFQImage/5
        [HttpGet("{id}")]
        public async Task<ActionResult<RFQImage>> GetRFQImage(int id)
        {
            var rfqImage = await _context.RFQImages
                .Include(ri => ri.RFQ)
                .FirstOrDefaultAsync(ri => ri.Id == id);

            if (rfqImage == null)
            {
                return NotFound();
            }

            return rfqImage;
        }

        // POST: api/RFQImage
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<RFQImage>> PostRFQImage(RFQImage rfqImage)
        {
            // To be implemented
            _context.RFQImages.Add(rfqImage);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetRFQImage", new { id = rfqImage.Id }, rfqImage);
        }

        // DELETE: api/RFQImage/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRFQImage(int id)
        {
            // To be implemented
            var rfqImage = await _context.RFQImages.FindAsync(id);
            if (rfqImage == null)
            {
                return NotFound();
            }

            _context.RFQImages.Remove(rfqImage);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/RFQImage/RFQ/5
        [HttpGet("RFQ/{rfqId}")]
        public async Task<ActionResult<IEnumerable<RFQImage>>> GetRFQImagesByRFQId(int rfqId)
        {
            var rfqImages = await _context.RFQImages
                .Where(r => r.RFQId == rfqId)
                .ToListAsync();
            if (rfqImages == null || !rfqImages.Any())
            {
                return NotFound();
            }
            return rfqImages;
        }

        private bool RFQImageExists(int id)
        {
            return _context.RFQImages.Any(e => e.Id == id);
        }
    }
}
