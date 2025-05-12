
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RenovationApp.Server.Data;
using RenovationApp.Server.Models;

namespace RenovationApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Policy = "projectManagersOnly")]
    public class ProjectServiceInvoicesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProjectServiceInvoicesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/ProjectServiceInvoices
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProjectServiceInvoice>>> GetProjectServiceInvoices()
        {
            return await _context.ProjectServiceInvoices.ToListAsync();
        }

        // GET: api/ProjectServiceInvoices/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProjectServiceInvoice>> GetProjectServiceInvoice(int id)
        {
            var projectServiceInvoice = await _context.ProjectServiceInvoices.FindAsync(id);

            if (projectServiceInvoice == null)
            {
                return NotFound();
            }

            return projectServiceInvoice;
        }

        // PUT: api/ProjectServiceInvoices/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProjectServiceInvoice(int id, ProjectServiceInvoice projectServiceInvoice)
        {
            if (id != projectServiceInvoice.Id)
            {
                return BadRequest();
            }

            _context.Entry(projectServiceInvoice).State = EntityState.Modified;

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

        // POST: api/ProjectServiceInvoices
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ProjectServiceInvoice>> PostProjectServiceInvoice(ProjectServiceInvoice projectServiceInvoice)
        {
            _context.ProjectServiceInvoices.Add(projectServiceInvoice);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetProjectServiceInvoice", new { id = projectServiceInvoice.Id }, projectServiceInvoice);
        }

        // DELETE: api/ProjectServiceInvoices/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProjectServiceInvoice(int id)
        {
            var projectServiceInvoice = await _context.ProjectServiceInvoices.FindAsync(id);
            if (projectServiceInvoice == null)
            {
                return NotFound();
            }

            _context.ProjectServiceInvoices.Remove(projectServiceInvoice);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProjectServiceInvoiceExists(int id)
        {
            return _context.ProjectServiceInvoices.Any(e => e.Id == id);
        }
    }
}
