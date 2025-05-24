using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RenovationApp.Server.Data;
using RenovationApp.Server.Models;

namespace RenovationApp.Server.Controllers
{
    [ApiController]
    [Route("/renotags")]
    public class RenovationTagsController : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public RenovationTagsController(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var tags = await _db.RenovationTags.ToListAsync();
            return Ok(tags);
        }

        [HttpPost]
        [Authorize(Policy = "projectManagersOnly")]
        public async Task<IActionResult> Create([FromBody] RenovationTag tag)
        {
            if (string.IsNullOrWhiteSpace(tag.Id))
                return BadRequest("Tag Id is required.");

            if (await _db.RenovationTags.AnyAsync(t => t.Id == tag.Id))
                return Conflict("Tag already exists.");

            _db.RenovationTags.Add(tag);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(Create), new { id = tag.Id }, tag);
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = "projectManagersOnly")]
        public async Task<IActionResult> Delete(string id)
        {
            var tag = await _db.RenovationTags.FindAsync(id);
            if (tag == null)
                return NotFound();

            // Remove tag from all projects
            var projectsWithTag = await _db.Projects
                .Include(p => p.RenovationTags)
                .Where(p => p.RenovationTags != null && p.RenovationTags.Any(t => t.Id == id))
                .ToListAsync();

            foreach (var project in projectsWithTag)
            {
                project.RenovationTags?.Remove(tag);
            }

            _db.RenovationTags.Remove(tag);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}
