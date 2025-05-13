using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RenovationApp.Server.Data;
using RenovationApp.Server.Models;
using RenovationApp.Server.DTOs;

namespace RenovationApp.Server.Controllers
{
    [Route("api/projects/{projectId}/communications")]
    [ApiController]
    public class ProjectCommunicationsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProjectCommunicationsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/projects/{projectId}/communications
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProjectCommunication>>> GetProjectCommunications(int projectId)
        {
            var project = await _context.Projects.FindAsync(projectId);
            if (project == null)
            {
                return NotFound("Project not found");
            }

            return await _context.ProjectCommunications
                .Where(c => c.ProjectId == projectId)
                .ToListAsync();
        }

        // GET: api/projects/{projectId}/communications/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<ProjectCommunication>> GetProjectCommunication(int projectId, int id)
        {
            var project = await _context.Projects.FindAsync(projectId);
            if (project == null)
            {
                return NotFound("Project not found");
            }

            var communication = await _context.ProjectCommunications
                .FirstOrDefaultAsync(c => c.ProjectId == projectId && c.Id == id);

            if (communication == null)
            {
                return NotFound();
            }

            return communication;
        }

        // PUT: api/projects/{projectId}/communications/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProjectCommunication(int projectId, int id, ProjectCommunicationDto dto)
        {

            var project = await _context.Projects.FindAsync(projectId);
            if (project == null)
            {
                return NotFound("Project not found");
            }

            var existingCommunication = await _context.ProjectCommunications
                .FirstOrDefaultAsync(c => c.ProjectId == projectId && c.Id == id);

            if (existingCommunication == null)
            {
                return NotFound("Communication not found");
            }

            // Map DTO to entity
            existingCommunication.Message = dto.Message;

            _context.Entry(existingCommunication).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProjectCommunicationExists(id))
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

        // POST: api/projects/{projectId}/communications
        [HttpPost]
        public async Task<ActionResult<ProjectCommunication>> PostProjectCommunication(int projectId, ProjectCommunicationDto dto)
        {
            var project = await _context.Projects.FindAsync(projectId);
            if (project == null)
            {
                return BadRequest("Invalid project ID");
            }

            // Map DTO to entity
            var newCommunication = new ProjectCommunication
            {
                ProjectId = projectId,
                Message = dto.Message,
                CreatedTimestamp = DateTime.UtcNow
            };

            _context.ProjectCommunications.Add(newCommunication);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetProjectCommunication", new { projectId, id = newCommunication.Id }, newCommunication);
        }

        // DELETE: api/projects/{projectId}/communications/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProjectCommunication(int projectId, int id)
        {
            var project = await _context.Projects.FindAsync(projectId);
            if (project == null)
            {
                return NotFound("Project not found");
            }

            var communication = await _context.ProjectCommunications
                .FirstOrDefaultAsync(c => c.ProjectId == projectId && c.Id == id);

            if (communication == null)
            {
                return NotFound();
            }

            _context.ProjectCommunications.Remove(communication);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProjectCommunicationExists(int id)
        {
            return _context.ProjectCommunications.Any(e => e.Id == id);
        }
    }
}
