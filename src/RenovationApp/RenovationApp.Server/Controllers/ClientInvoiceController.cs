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
    public class ClientInvoiceController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ClientInvoiceController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ClientInvoiceDto>>> GetClientInvoices()
        {
            var invoices = await _context.ClientInvoices
                .OrderByDescending(i => i.CreatedTimestamp)
                .ToListAsync();

            return invoices.Select(DTOMapper.ToDto).ToList();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ClientInvoiceDto>> GetClientInvoice(int id)
        {
            var invoice = await _context.ClientInvoices.FindAsync(id);
            if (invoice == null)
                return NotFound();

            return DTOMapper.ToDto(invoice);
        }

        [HttpPost]
        public async Task<ActionResult<ClientInvoiceDto>> CreateClientInvoice(ClientInvoiceDto dto)
        {
            var entity = DTOMapper.ToEntity(dto);
            entity.CreatedTimestamp = DateTime.UtcNow;

            _context.ClientInvoices.Add(entity);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetClientInvoice), new { id = entity.Id }, DTOMapper.ToDto(entity));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateClientInvoice(int id, ClientInvoiceDto dto)
        {
            if (id != dto.Id)
                return BadRequest();

            var existing = await _context.ClientInvoices.FindAsync(id);
            if (existing == null)
                return NotFound();

            existing.Description = dto.Description;
            existing.PaymentInstructions = dto.PaymentInstructions;
            existing.Paid = dto.Paid;
            existing.Amount = dto.Amount;
            existing.ProjectId = dto.ProjectId;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteClientInvoice(int id)
        {
            var invoice = await _context.ClientInvoices.FindAsync(id);
            if (invoice == null)
                return NotFound();

            _context.ClientInvoices.Remove(invoice);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool InvoiceExists(int id)
        {
            return _context.ClientInvoices.Any(i => i.Id == id);
        }
    }
}
