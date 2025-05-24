using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RenovationApp.Server.Data;
using RenovationApp.Server.DTOs;
using RenovationApp.Server.Models;

namespace RenovationApp.Server.Controllers
{
    [Route("projects/{projectId}/services")]
    [ApiController]
    [Authorize(Policy = "projectManagersOnly")]
    public class ProjectServicesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProjectServicesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/projects/{projectId}/services
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProjectService>>> GetProjectServices(int projectId)
        {
            var project = await _context.Projects.FindAsync(projectId);
            if (project == null)
            {
                return NotFound("Project not found");
            }

            var services = await _context.ProjectServices
                .Where(s => s.ProjectId == projectId)
                .ToListAsync();

            return Ok(services);
        }

        // GET: api/projects/{projectId}/services/{serviceId}
        [HttpGet("{serviceId}")]
        public async Task<ActionResult<ProjectService>> GetProjectService(int projectId, int serviceId)
        {
            var service = await _context.ProjectServices
                .FirstOrDefaultAsync(s => s.ProjectId == projectId && s.Id == serviceId);

            if (service == null)
            {
                return NotFound();
            }

            return service;
        }

        // POST: api/projects/{projectId}/services
        [HttpPost]
        public async Task<ActionResult<ProjectService>> PostProjectService(int projectId, ProjectServiceCreateDTO dto)
        {
            var project = await _context.Projects.FindAsync(projectId);
            if (project == null)
            {
                return NotFound("Project not found");
            }

            var service = new ProjectService
            {
                ProjectId = projectId,
                Name = dto.Name,
                Description = dto.Description,
                ProjectServiceTypeId = dto.ProjectServiceTypeId,
                QuotePrice = dto.QuotePrice,
                QuoteCost = dto.QuoteCost,
                QuoteStartDate = dto.QuoteStartDate,
                QuoteEndDate = dto.QuoteEndDate,
                ActualStartDate = dto.ActualStartDate,
                ActualEndDate = dto.ActualEndDate,
                Status = dto.Status
            };

            _context.ProjectServices.Add(service);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProjectService), new { projectId = projectId, serviceId = service.Id }, service);
        }

        // PUT: api/projects/{projectId}/services/{serviceId}
        [HttpPut("{serviceId}")]
        public async Task<IActionResult> PutProjectService(int projectId, int serviceId, ProjectServiceUpdateDTO dto)
        {
            var service = await _context.ProjectServices
                .FirstOrDefaultAsync(s => s.ProjectId == projectId && s.Id == serviceId);

            if (service == null)
            {
                return NotFound();
            }

            // Update fields only if they are provided in the DTO
            if (!string.IsNullOrEmpty(dto.Name))
            {
                service.Name = dto.Name;
            }

            if (!string.IsNullOrEmpty(dto.Description))
            {
                service.Description = dto.Description;
            }

            if (dto.ProjectServiceTypeId.HasValue)
            {
                service.ProjectServiceTypeId = dto.ProjectServiceTypeId.Value;
            }

            if (dto.QuotePrice.HasValue)
            {
                service.QuotePrice = dto.QuotePrice.Value;
            }

            if (dto.QuoteCost.HasValue)
            {
                service.QuoteCost = dto.QuoteCost.Value;
            }

            if (dto.QuoteStartDate.HasValue)
            {
                service.QuoteStartDate = dto.QuoteStartDate.Value;
            }

            if (dto.QuoteEndDate.HasValue)
            {
                service.QuoteEndDate = dto.QuoteEndDate.Value;
            }

            if (dto.ActualStartDate.HasValue)
            {
                service.ActualStartDate = dto.ActualStartDate.Value;
            }

            if (dto.ActualEndDate.HasValue)
            {
                service.ActualEndDate = dto.ActualEndDate.Value;
            }

            if (!string.IsNullOrEmpty(dto.Status))
            {
                service.Status = dto.Status;
            }

            _context.Entry(service).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProjectServiceExists(serviceId))
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

        // DELETE: api/projects/{projectId}/services/{serviceId}
        [HttpDelete("{serviceId}")]
        public async Task<IActionResult> DeleteProjectService(int projectId, int serviceId)
        {
            var service = await _context.ProjectServices
                .FirstOrDefaultAsync(s => s.ProjectId == projectId && s.Id == serviceId);

            if (service == null)
            {
                return NotFound();
            }

            _context.ProjectServices.Remove(service);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProjectServiceExists(int id)
        {
            return _context.ProjectServices.Any(e => e.Id == id);
        }
    }
}
