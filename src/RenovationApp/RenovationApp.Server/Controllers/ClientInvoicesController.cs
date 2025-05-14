using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RenovationApp.Server.Data;
using RenovationApp.Server.Models;

namespace RenovationApp.Server.Controllers
{
    [Route("projects/{projectId}/clientinvoices")]
    [ApiController]
    [Authorize]
    public class ClientInvoicesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ClientInvoicesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: projects/{projectId}/clientinvoices
        [HttpGet]
        [Authorize(Policy = "projectManagerOnly")]
        public async Task<ActionResult<IEnumerable<ClientInvoice>>> GetClientInvoices(int projectId)
        {
            if (!await ProjectExists(projectId))
            {
                return NotFound("Project not found.");
            }

            return await _context.ClientInvoices
                .Where(ci => ci.ProjectId == projectId)
                .ToListAsync();
        }

        // GET: projects/{projectId}/clientinvoices/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<ClientInvoice>> GetClientInvoice(int projectId, int id)
        {
            if (!await ProjectExists(projectId))
            {
                return NotFound("Project not found.");
            }

            var clientInvoice = await _context.ClientInvoices
                .FirstOrDefaultAsync(ci => ci.Id == id && ci.ProjectId == projectId);

            if (clientInvoice == null)
            {
                return NotFound();
            }

            return clientInvoice;
        }

        // PUT: projects/{projectId}/clientinvoices/{id}
        [HttpPut("{id}")]
        [Authorize(Policy = "projectManagerOnly")]
        public async Task<IActionResult> PutClientInvoice(int projectId, int id, ClientInvoiceDto clientInvoiceDto)
        {
            if (!await ProjectExists(projectId))
            {
                return NotFound("Project not found.");
            }

            var clientInvoice = await _context.ClientInvoices
                .FirstOrDefaultAsync(ci => ci.Id == id && ci.ProjectId == projectId);

            if (clientInvoice == null)
            {
                return NotFound();
            }

            clientInvoice.Description = clientInvoiceDto.Description;
            clientInvoice.PaymentInstructions = clientInvoiceDto.PaymentInstructions;
            clientInvoice.Amount = clientInvoiceDto.Amount;

            _context.Entry(clientInvoice).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClientInvoiceExists(id))
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

        // POST: projects/{projectId}/clientinvoices
        [HttpPost]
        [Authorize(Policy = "projectManagerOnly")]
        public async Task<ActionResult<ClientInvoice>> PostClientInvoice(int projectId, ClientInvoiceDto clientInvoiceDto)
        {
            if (!await ProjectExists(projectId))
            {
                return NotFound("Project not found.");
            }

            var clientInvoice = new ClientInvoice
            {
                ProjectId = projectId,
                Description = clientInvoiceDto.Description,
                PaymentInstructions = clientInvoiceDto.PaymentInstructions,
                Amount = clientInvoiceDto.Amount,
                CreatedTimestamp = DateTime.UtcNow
            };

            _context.ClientInvoices.Add(clientInvoice);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetClientInvoice", new { projectId, id = clientInvoice.Id }, clientInvoice);
        }

        // DELETE: projects/{projectId}/clientinvoices/{id}
        [HttpDelete("{id}")]
        [Authorize(Policy = "projectManagerOnly")]
        public async Task<IActionResult> DeleteClientInvoice(int projectId, int id)
        {
            if (!await ProjectExists(projectId))
            {
                return NotFound("Project not found.");
            }

            var clientInvoice = await _context.ClientInvoices
                .FirstOrDefaultAsync(ci => ci.Id == id && ci.ProjectId == projectId);

            if (clientInvoice == null)
            {
                return NotFound();
            }

            _context.ClientInvoices.Remove(clientInvoice);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // PUT: projects/{projectId}/clientinvoices/{id}/pay
        [HttpPut("{id}/pay")]
        public async Task<IActionResult> PayClientInvoice(int projectId, int id)
        {
            var project =  _context.Projects.FirstOrDefault(p => p.Id == projectId);
            
            if (project == null)
            {
                return NotFound("Project not found.");
            }

            string? UserId = GetUserId(User);
            if (string.IsNullOrEmpty(UserId))
            {
                return BadRequest("User ID is required.");
            }

            if (!User.IsInRole("projectManager") && project.ClientId != UserId )
            {
                return Unauthorized("You are not authorized to pay this invoice.");
            }

            var clientInvoice = await _context.ClientInvoices
                .FirstOrDefaultAsync(ci => ci.Id == id && ci.ProjectId == projectId);

            if (clientInvoice == null)
            {
                return NotFound();
            }

            clientInvoice.Paid = DateTime.Now; // Set to local time
            _context.Entry(clientInvoice).State = EntityState.Modified;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        private async Task<bool> ProjectExists(int projectId)
        {
            return await _context.Projects.AnyAsync(e => e.Id == projectId);
        }

        private bool ClientInvoiceExists(int id)
        {
            return _context.ClientInvoices.Any(e => e.Id == id);
        }
        private string? GetUserId(ClaimsPrincipal user)
        {
            return user.Claims.FirstOrDefault(c => c.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")?.Value;
        }
    }
}
