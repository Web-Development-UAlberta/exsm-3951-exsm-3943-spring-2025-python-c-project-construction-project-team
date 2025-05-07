using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RenovationApp.Server.Data;
using RenovationApp.Server.Models;
using Microsoft.AspNetCore.Authorization;

namespace RenovationApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin,ProjectManager")]
    public class ClientInvoicesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ClientInvoicesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/ClientInvoices
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ClientInvoice>>> GetClientInvoice()
        {
            try
            {
                return await _context.ClientInvoice
                    .Include(ci => ci.Project)
                    .ThenInclude(p => p.Client)
                    .ToListAsync();
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error retrieving data from the database.");
            }
        }

        // GET: api/ClientInvoices/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ClientInvoice>> GetClientInvoice(int id)
        {
            try
            {
                var clientInvoice = await _context.ClientInvoice
                .Include(ci => ci.Project)
                .ThenInclude(p => p.Client)
                .FirstOrDefaultAsync(ci => ci.Id == id);

                if (clientInvoice == null)
                {
                    return NotFound();
                }

                return clientInvoice;
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error retrieving data from the database.");
            }
        }

        // PUT: api/ClientInvoices/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutClientInvoice(int id, ClientInvoice clientInvoice)
        {
            try
            {
                if (id != clientInvoice.Id)
                {
                    return BadRequest("Invoice ID mismatch.");
                }

                var existingInvoice = await _context.ClientInvoice.FindAsync(id);
                if (existingInvoice == null)
                {
                    return NotFound();
                }

                int projectId = existingInvoice.ProjectId;

                existingInvoice.Description = clientInvoice.Description;
                existingInvoice.PaymentInstructions = clientInvoice.PaymentInstructions;
                existingInvoice.Amount = clientInvoice.Amount;
                existingInvoice.Paid = clientInvoice.Paid;

                existingInvoice.ProjectId = projectId;

                _context.Entry(existingInvoice).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                return NoContent();
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
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error updating invoice record.");
            }
        }

        // POST: api/ClientInvoices
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ClientInvoice>> CreateClientInvoice(ClientInvoice clientInvoice)
        {
            try
            {
                var project = await _context.Projects.FindAsync(clientInvoice.ProjectId);
                if (project == null)
                {
                    return BadRequest("The specified project does not exist.");
                }

                clientInvoice.CreatedTimestamp = DateTime.UtcNow;

                _context.ClientInvoice.Add(clientInvoice);
                await _context.SaveChangesAsync();

                await _context.Entry(clientInvoice)
                    .Reference(ci => ci.Project)
                    .LoadAsync();
                await _context.Entry(clientInvoice)
                    .Reference(ci => ci.Project.Client)
                    .LoadAsync();

                return CreatedAtAction("GetClientInvoice", new { id = clientInvoice.Id }, clientInvoice);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error creating new invoice record.");
            }
        }

        // DELETE: api/ClientInvoices/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteClientInvoice(int id)
        {
           try
           {
                var clientInvoice = await _context.ClientInvoice.FindAsync(id);
                if (clientInvoice == null)
                {
                    return NotFound();
                }

                _context.ClientInvoice.Remove(clientInvoice);
                await _context.SaveChangesAsync();

                return NoContent();
           }
           catch (Exception)
           {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error deleting invoice record.");
           }
        }

        // GET: api/ClientInvoices/Project/5
        [HttpGet("Project/{projectId}")]
        public async Task<ActionResult<IEnumerable<ClientInvoice>>> GetClientInvoicesByProject(int projectId)
        {
            try
            {
                var project = await _context.Projects.FindAsync(projectId);
                if (project == null)
                {
                    return NotFound("Project not found.");
                }

                var clientInvoices = await _context.ClientInvoice
                .Where(ci => ci.ProjectId == projectId)
                .ToListAsync();
                if (clientInvoices == null || !clientInvoices.Any())
                {
                    return NotFound();
                }
                return clientInvoices;
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error retrieving data from the database.");
            }
        }

        // GET: api/ClientInvoices/Unpaid
        [HttpGet("Unpaid")]
        public async Task<ActionResult<IEnumerable<ClientInvoice>>> GetUnpaidClientInvoices()
        {
            try
            {
                var unpaidInvoices = await _context.ClientInvoice
                    .Include(ci => ci.Project)
                    .ThenInclude(p => p.Client)
                    .Where(ci => ci.Paid == null)
                    .ToListAsync();
                if (unpaidInvoices == null || !unpaidInvoices.Any())
                {
                    return NotFound("No unpaid invoices found.");
                }
                return unpaidInvoices;
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error retrieving data from the database.");
            }
        }

        private bool ClientInvoiceExists(int id)
        {
            return _context.ClientInvoice.Any(e => e.Id == id);
        }
    }
}
