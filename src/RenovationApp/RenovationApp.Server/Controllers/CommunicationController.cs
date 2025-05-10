using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RenovationApp.Server.Data;
using RenovationApp.Server.DTOs;
using RenovationApp.Server.Helpers;
using RenovationApp.Server.Models;

namespace RenovationApp.Server.Controllers
{
    [ApiController]
    [Route("/[controller]")]
    [Authorize]
    public class CommunicationController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CommunicationController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProjectCommunicationDto>>> GetCommunications()
        {
            var communications = await _context.ProjectCommunications
                .OrderByDescending(c => c.CreatedTimestamp)
                .ToListAsync();

            return communications.Select(DTOMapper.ToDto).ToList();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProjectCommunicationDto>> GetCommunication(int id)
        {
            var communication = await _context.ProjectCommunications.FindAsync(id);
            if (communication == null)
                return NotFound();

            return DTOMapper.ToDto(communication);
        }

        [HttpGet("Project/{projectId}")]
        public async Task<ActionResult<IEnumerable<ProjectCommunicationDto>>> GetCommunicationsByProject(int projectId)
        {
            var project = await _context.Projects.FindAsync(projectId);
            if (project == null)
                return NotFound("Project not found");

            var communications = await _context.ProjectCommunications
                .Where(c => c.ProjectId == projectId)
                .OrderByDescending(c => c.CreatedTimestamp)
                .ToListAsync();

            return communications.Select(DTOMapper.ToDto).ToList();
        }


        [HttpPost]
        public async Task<ActionResult<ProjectCommunicationDto>> CreateCommunication(ProjectCommunicationDto dto)
        {
            var project = await _context.Projects.FindAsync(dto.ProjectId);
            if (project == null)
                return BadRequest("Invalid project ID");

            var entity = DTOMapper.ToEntity(dto);
            entity.CreatedTimestamp = DateTime.UtcNow;

            _context.ProjectCommunications.Add(entity);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCommunication), new { id = entity.Id }, DTOMapper.ToDto(entity));
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCommunication(int id, ProjectCommunicationDto dto)
        {
            if (id != dto.Id)
                return BadRequest();

            var existing = await _context.ProjectCommunications.FindAsync(id);
            if (existing == null)
                return NotFound();

            existing.Message = dto.Message;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CommunicationExists(id))
                    return NotFound();
                throw;
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCommunication(int id)
        {
            var communication = await _context.ProjectCommunications.FindAsync(id);
            if (communication == null)
                return NotFound();

            _context.ProjectCommunications.Remove(communication);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CommunicationExists(int id)
        {
            return _context.ProjectCommunications.Any(e => e.Id == id);
        }
    }
}
