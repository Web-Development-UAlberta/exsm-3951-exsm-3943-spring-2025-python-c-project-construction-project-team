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
    public class ProjectServiceInvoiceController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public ProjectServiceInvoiceController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/ProjectServiceInvoice
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProjectServiceInvoice>>> GetProjectServiceInvoices()
        {
            try
            {
                return await _context.ProjectServiceInvoices
                    .Include(psi => psi.ProjectService)
                    .ToListAsync();
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error retrieving data from the database.");
            }
        }

        // GET: api/ProjectServiceInvoice/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProjectServiceInvoice>> GetProjectServiceInvoice(int id)
        {
            var projectServiceInvoice = await _context.ProjectServiceInvoices
                .Include(psi => psi.ProjectService)
                .ThenInclude(ps => ps.Project)
                .FirstOrDefaultAsync(psi => psi.Id == id);

            if (projectServiceInvoice == null)
            {
                return NotFound();
            }
            return projectServiceInvoice;
        }

        // POST: api/ProjectServiceInvoice
        [HttpPost]
        [Authorize(Roles = "Admin,ProjectManager")]
        public async Task<ActionResult<ProjectServiceInvoice>> CreateProjectServiceInvoice(ProjectServiceInvoice projectServiceInvoice)
        {
            try
            {
                projectServiceInvoice.CreatedTimeStamp = DateTime.UtcNow;

                _context.ProjectServiceInvoices.Add(projectServiceInvoice);
                await _context.SaveChangesAsync();

                await _context.Entry(projectServiceInvoice)
                    .Reference(psi => psi.ProjectService)
                    .LoadAsync();

                return CreatedAtAction(nameof(GetProjectServiceInvoice), new { id = projectServiceInvoice.Id }, projectServiceInvoice);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error creating new invoice record.");
            }
        }

        // PUT: api/ProjectServiceInvoice/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,ProjectManager")]
        public async Task<IActionResult> PutProjectServiceInvoice(int id, ProjectServiceInvoice updatedInvoice)
        {
            try
            {
                if (id != updatedInvoice.Id)
                {
                    return BadRequest("Invoice ID mismatch.");
                }

                var existingInvoice = await _context.ProjectServiceInvoices.FindAsync(id);
                if (existingInvoice == null)
                {
                    return NotFound();
                }

                existingInvoice.Amount = updatedInvoice.Amount;
                existingInvoice.Paid = updatedInvoice.Paid;

                _context.Entry(existingInvoice).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProjectServiceInvoiceExists(id))
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
                return StatusCode(StatusCodes.Status500InternalServerError, "Error updating invoice record.");
            }
        }

        // DELETE: api/ProjectServiceInvoice/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,ProjectManager")]
        public async Task<IActionResult> DeleteProjectServiceInvoice(int id)
        {
            try
            {
                var projectServiceInvoice = await _context.ProjectServiceInvoices.FindAsync(id);
                if (projectServiceInvoice == null)
                {
                    return NotFound();
                }

                var projectService = await _context.ProjectServices
                    .Include(ps => ps.ProjectServiceInvoices)
                    .FirstOrDefaultAsync(ps => ps.Id == projectServiceInvoice.ProjectServiceId);

                if (projectService == null)
                {
                    return NotFound("Associated Project Service not found.");
                }

                _context.ProjectServiceInvoices.Remove(projectServiceInvoice);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error deleting invoice from the database.");
            }
        }

        // GET: api/ProjectServiceInvoice/Service/5
        [HttpGet("ProjectService/{id}")]
        public async Task<ActionResult<IEnumerable<ProjectServiceInvoice>>> GetInvoicesByProjectServiceId(int id)
        {
            var projectService = await _context.ProjectServices.FindAsync(id);
            if (projectService == null)
            {
                return NotFound("Project service not found.");
            }

            var invoices = await _context.ProjectServiceInvoices
                .Include(psi => psi.ProjectService)
                .Where(psi => psi.ProjectServiceId == id)
                .ToListAsync();
            if (invoices == null || !invoices.Any())
            {
                return NotFound("No invoices found for this project service.");
            }
            return invoices;
        }

        private bool ProjectServiceInvoiceExists(int id)
        {
            return _context.ProjectServiceInvoices.Any(e => e.Id == id);
        }
    }
}
