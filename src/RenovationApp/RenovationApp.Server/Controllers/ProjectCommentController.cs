using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RenovationApp.Server.Data;
using RenovationApp.Server.Models;

namespace RenovationApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectCommentController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProjectCommentController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/ProjectComments
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProjectComment>>> GetProjectComments()
        {
            return await _context.ProjectComments.ToListAsync();
        }

        // GET: api/ProjectComments/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProjectComment>> GetProjectComment(int id)
        {
            var projectComment = await _context.ProjectComments.FindAsync(id);

            if (projectComment == null)
            {
                return NotFound();
            }

            return projectComment;
        }

        // PUT: api/ProjectComments/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProjectComment(int id, ProjectComment projectComment)
        {
            if (id != projectComment.Id)
            {
                return BadRequest();
            }

            _context.Entry(projectComment).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProjectCommentExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/ProjectComments
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ProjectComment>> PostProjectComment(ProjectComment projectComment)
        {
            _context.ProjectComments.Add(projectComment);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetProjectComment", new { id = projectComment.Id }, projectComment);
        }

        // DELETE: api/ProjectComments/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProjectComment(int id)
        {
            var projectComment = await _context.ProjectComments.FindAsync(id);
            if (projectComment == null)
            {
                return NotFound();
            }

            _context.ProjectComments.Remove(projectComment);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProjectCommentExists(int id)
        {
            return _context.ProjectComments.Any(e => e.Id == id);
        }
    }
}
