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
    [Authorize(Roles = "Admin,ProjectManager")]
    public class ProjectServiceController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProjectServiceController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/ProjectService
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProjectService>>> GetProjectServices()
        {
            try
            {
                return await _context.ProjectServices
                    .Include(ps => ps.Project)
                    .Include(ps => ps.Supplier)
                    .Include(ps => ps.ProjectServiceType)
                    .ToListAsync();
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error retrieving data from the database.");
            }
        }

        // GET: api/ProjectService/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProjectService>> GetProjectService(int id)
        {
            try
            {
                var projectService = await _context.ProjectServices
                    .Include(ps => ps.Project)
                    .Include(ps => ps.Supplier)
                    .Include(ps => ps.ProjectServiceType)
                    .Include(ps => ps.ProjectServiceInvoices)
                    .FirstOrDefaultAsync(ps => ps.Id == id);
                if (projectService == null)
                {
                    return NotFound();
                }
                return projectService;
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error retrieving data from the database.");
            }
        }

        // POST: api/ProjectService
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ProjectService>> CreateProjectService(ProjectService projectService)
        {
            try
            {
                var project = await _context.Projects.FindAsync(projectService.ProjectId);
                if (project == null)
                {
                    return NotFound("Project not found.");
                }

                if (projectService.ActualStartDate == default)
                {
                    projectService.ActualStartDate = null;
                }
                if (projectService.ActualEndDate == default)
                {
                    projectService.ActualEndDate = null;
                }
                if (projectService.QuoteStartDate == default)
                {
                    projectService.QuoteStartDate = DateTime.UtcNow;
                }
                if (projectService.QuoteEndDate == default)
                {
                    projectService.QuoteEndDate = DateTime.UtcNow.AddDays(30);
                }

                _context.ProjectServices.Add(projectService);
                await _context.SaveChangesAsync();

                await _context.Entry(projectService)
                    .Reference(p => p.Project)
                    .LoadAsync();
                await _context.Entry(projectService)
                    .Reference(p => p.ProjectServiceType)
                    .LoadAsync();
                await _context.Entry(projectService)
                    .Reference(p => p.Supplier)
                    .LoadAsync();
                await _context.Entry(projectService)
                    .Collection(p => p.ProjectServiceInvoices)
                    .LoadAsync();

                return CreatedAtAction("GetProjectService", new { id = projectService.Id }, projectService);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error retrieving data from the database.");
            }
        }

        // PUT: api/ProjectService/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProjectService(int id, ProjectService projectService)
        {
            if (id != projectService.Id)
            {
                return BadRequest();
            }

            try
            {
                var existingProjectService = await _context.ProjectServices.FindAsync(id);
                if (existingProjectService == null)
                {
                    return NotFound();
                }

                int? projectId = existingProjectService.ProjectId;

                existingProjectService.Description = projectService.Description;
                existingProjectService.ServiceType = projectService.ServiceType;
                existingProjectService.QuotePrice = projectService.QuotePrice;
                existingProjectService.QuoteCost = projectService.QuoteCost;
                existingProjectService.QuoteStartDate = projectService.QuoteStartDate;
                existingProjectService.QuoteEndDate = projectService.QuoteEndDate;
                existingProjectService.ActualStartDate = projectService.ActualStartDate;
                existingProjectService.ActualEndDate = projectService.ActualEndDate;
                existingProjectService.Status = projectService.Status;

                if (projectService.ActualStartDate != default)
                {
                    existingProjectService.ActualStartDate = projectService.ActualStartDate;
                }
                if (projectService.ActualEndDate != default)
                {
                    existingProjectService.ActualEndDate = projectService.ActualEndDate;
                }

                existingProjectService.ProjectId = projectId;

                _context.Entry(existingProjectService).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProjectServiceExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error updating data in the database.");
            }
        }

        // DELETE: api/ProjectService/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProjectService(int id)
        {
            try
            {
                var projectService = await _context.ProjectServices
                    .Include(p => p.ProjectServiceInvoices)
                    .FirstOrDefaultAsync(p => p.Id == id);

                if (projectService == null)
                {
                    return NotFound();
                }

                if (projectService.ProjectServiceInvoices.Any())
                {
                    return BadRequest("Cannot delete a project service that has associated invoices.");
                }

                _context.ProjectServices.Remove(projectService);
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error deleting data from the database.");
            }
        }

        // GET: api/ProjectService/Project/5
        [HttpGet("Project/{projectId}")]
        public async Task<ActionResult<IEnumerable<ProjectService>>> GetProjectServicesByProject(int projectId)
        {
            try
            {
                var project = await _context.Projects.FindAsync(projectId);
                if (project == null)
                {
                    return NotFound();
                }
                return await _context.ProjectServices
                    .Include(ps => ps.Supplier)
                    .Include(ps => ps.ProjectServiceType)
                    .Include(ps => ps.ProjectServiceInvoices)
                    .Where(ps => ps.ProjectId == projectId)
                    .ToListAsync();
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error retrieving data from the database.");
            }
        }

        // GET: api/ProjectService/Supplier/5
        [HttpGet("Supplier/{supplierId}")]
        public async Task<ActionResult<IEnumerable<ProjectService>>> GetProjectServicesBySupplier(int supplierId)
        {
            try
            {
                var supplier = await _context.Suppliers.FindAsync(supplierId);
                if (supplier == null)
                {
                    return NotFound();
                }
                // Fetch the project services for the specified supplier
                return await _context.ProjectServices
                    .Include(ps => ps.Project)
                    .Include(ps => ps.ProjectServiceType)
                    .Where(ps => ps.SupplierId == supplierId)
                    .ToListAsync();
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error retrieving data from the database.");
            }
        }

        // GET: api/ProjectService/ProjectServiceType/5
        [HttpGet("ProjectServiceType/{serviceType}")]
        public async Task<ActionResult<IEnumerable<ProjectService>>> GetProjectServicesByServiceType(string serviceType)
        {
            try
            {
                var projectServiceType = await _context.ProjectServiceTypes.FindAsync(serviceType);
                if (projectServiceType == null)
                {
                    return NotFound();
                }
                return await _context.ProjectServices
                    .Include(ps => ps.Supplier)
                    .Include(ps => ps.Project)
                    .Where(ps => ps.ServiceType == serviceType)
                    .ToListAsync();
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error retrieving data from the database.");
            }
        }

        // GET: api/ProjectServices/Status/5
        [HttpGet("Status/{status}")]
        public async Task<ActionResult<IEnumerable<ProjectService>>> GetProjectServicesByStatus(string status)
        {
            try
            {
                if (!Enum.TryParse<ProjectServiceStatus>(status, true, out var statusEnum))
                {
                    return BadRequest("Invalid status value.");
                }

                return await _context.ProjectServices
                    .Include(ps => ps.Supplier)
                    .Include(ps => ps.ProjectServiceType)
                    .Include(ps => ps.Project)
                    .Where(ps => ps.Status == statusEnum)
                    .ToListAsync();
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error retrieving data from the database.");
            }
        }

        // GET: api/ProjectService/5/Invoices
        [HttpGet("{id}/Invoices")]
        public async Task<ActionResult<IEnumerable<ProjectServiceInvoice>>> GetProjectServiceInvoices(int id)
        {
            try
            {
                if (!ProjectServiceExists(id))
                {
                    return NotFound();
                }
                return await _context.ProjectServiceInvoices
                    .Include(ps => ps.ProjectService)
                    .Where(ps => ps.ProjectServiceId == id)
                    .ToListAsync();
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error retrieving data from the database.");
            }
        }

        private bool ProjectServiceExists(int id)
        {
            return _context.ProjectServices.Any(e => e.Id == id);
        }
    }
}
