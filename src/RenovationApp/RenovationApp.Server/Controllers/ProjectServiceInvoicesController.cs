using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RenovationApp.Server.Data;
using RenovationApp.Server.DTOs;
using RenovationApp.Server.Models;

namespace RenovationApp.Server.Controllers
{
    [Route("projects/{projectId}/services/{serviceId}/invoice")]
    [ApiController]
    [Authorize(Policy = "projectManagersOnly")]
    public class ProjectServiceInvoicesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProjectServiceInvoicesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/projects/{projectId}/services/{serviceId}/invoice
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProjectServiceInvoice>>> GetProjectServiceInvoices(int projectId, int serviceId)
        {
            var service = await _context.ProjectServices
                .FirstOrDefaultAsync(s => s.ProjectId == projectId && s.Id == serviceId);

            if (service == null)
            {
                return NotFound("Service not found");
            }

            return await _context.ProjectServiceInvoices
                .Where(i => i.ProjectServiceId == serviceId)
                .ToListAsync();
        }

        // GET: api/projects/{projectId}/services/{serviceId}/invoice/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<ProjectServiceInvoice>> GetProjectServiceInvoice(int projectId, int serviceId, int id)
        {
            var invoice = await _context.ProjectServiceInvoices
                .FirstOrDefaultAsync(i => i.ProjectServiceId == serviceId && i.Id == id);

            if (invoice == null)
            {
                return NotFound();
            }

            return invoice;
        }

        // PUT: api/projects/{projectId}/services/{serviceId}/invoice/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProjectServiceInvoice(int projectId, int serviceId, int id, ProjectServiceInvoiceDTO dto)
        {
            var service = await _context.ProjectServices
                .FirstOrDefaultAsync(s => s.ProjectId == projectId && s.Id == serviceId);

            if (service == null)
            {
                return NotFound("Service not found");
            }

            var invoice = await _context.ProjectServiceInvoices
                .FirstOrDefaultAsync(i => i.ProjectServiceId == serviceId && i.Id == id);

            if (invoice == null)
            {
                return NotFound();
            }

            invoice.Amount = dto.Amount;
            invoice.Paid = dto.Paid;

            _context.Entry(invoice).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
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

            return NoContent();
        }

        // POST: api/projects/{projectId}/services/{serviceId}/invoice
        [HttpPost]
        public async Task<ActionResult<ProjectServiceInvoice>> PostProjectServiceInvoice(int projectId, int serviceId, ProjectServiceInvoiceDTO dto)
        {
            var service = await _context.ProjectServices
                .FirstOrDefaultAsync(s => s.ProjectId == projectId && s.Id == serviceId);

            if (service == null)
            {
                return NotFound("Service not found");
            }

            var invoice = new ProjectServiceInvoice
            {
                ProjectServiceId = serviceId,
                Amount = dto.Amount,
                Paid = dto.Paid
            };

            _context.ProjectServiceInvoices.Add(invoice);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetProjectServiceInvoice", new { projectId, serviceId, id = invoice.Id }, invoice);
        }

        // DELETE: api/projects/{projectId}/services/{serviceId}/invoice/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProjectServiceInvoice(int projectId, int serviceId, int id)
        {
            var invoice = await _context.ProjectServiceInvoices
                .FirstOrDefaultAsync(i => i.ProjectServiceId == serviceId && i.Id == id);

            if (invoice == null)
            {
                return NotFound();
            }

            _context.ProjectServiceInvoices.Remove(invoice);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProjectServiceInvoiceExists(int id)
        {
            return _context.ProjectServiceInvoices.Any(e => e.Id == id);
        }
    }
}
