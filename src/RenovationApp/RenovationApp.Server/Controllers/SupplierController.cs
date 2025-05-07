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
    public class SupplierController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SupplierController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Supplier
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Supplier>>> GetSuppliers()
        {
            return await _context.Suppliers
                .Include(s => s.SupplierServiceTypes)
                .ToListAsync();
        }

        // GET: api/Supplier/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Supplier>> GetSupplier(int id)
        {
            var supplier = await _context.Suppliers
                .Include(s => s.ProjectServices)
                .Include(s => s.SupplierServiceTypes)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (supplier == null)
            {
                return NotFound();
            }

            return supplier;
        }

        // PUT: api/Supplier/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSupplier(int id, Supplier supplier)
        {
            if (id != supplier.Id)
            {
                return BadRequest();
            }

            try
            {
                var existingSupplier = await _context.Suppliers.FindAsync(id);
                if (existingSupplier == null)
                {
                    return NotFound();
                }

                existingSupplier.BusinessName = supplier.BusinessName;
                existingSupplier.SalesmanName = supplier.SalesmanName;
                existingSupplier.Email = supplier.Email;
                existingSupplier.PhoneNumber = supplier.PhoneNumber;
                existingSupplier.Address = supplier.Address;

                _context.Entry(existingSupplier).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SupplierExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
        }

        // POST: api/Supplier
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Supplier>> CreateSupplier(Supplier supplier)
        {
            try
            {
                var existingSupplier = await _context.Suppliers
                    .FirstOrDefaultAsync(s => s.BusinessName == supplier.BusinessName);
                if (existingSupplier != null)
                {
                    return Conflict("Supplier with the same business name already exists.");
                }
                _context.Suppliers.Add(supplier);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetSupplier", new { id = supplier.Id }, supplier);
            }
            catch (DbUpdateException)
            {
                if (SupplierExists(supplier.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }
        }

        // DELETE: api/Supplier/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSupplier(int id)
        {
            var supplier = await _context.Suppliers
                .Include(s => s.ProjectServices)
                .FirstOrDefaultAsync(s => s.Id == id);
            if (supplier == null)
            {
                return NotFound();
            }

            if (supplier.ProjectServices.Any())
            {
                return BadRequest("Cannot delete supplier with associated project services.");
            }

            _context.Suppliers.Remove(supplier);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Updated method to return Task<ActionResult<ICollection<ProjectService>>>
        [HttpGet("{id}/ProjectServices")]
        public async Task<ActionResult<IEnumerable<ProjectService>>> GetSupplierProjectServices(int id)
        {
            var supplier = await _context.Suppliers
                .Include(s => s.ProjectServices)
                .FirstOrDefaultAsync(s => s.Id == id);
            if (supplier == null)
            {
                return NotFound();
            }
            return Ok(supplier.ProjectServices);
        }

        [HttpGet("{id}/SupplierServiceTypes")]
        public async Task<ActionResult<IEnumerable<SupplierServiceType>>> GetSupplierServiceTypes(int id)
        {
            var supplier = await _context.Suppliers
                .Include(s => s.SupplierServiceTypes)
                .FirstOrDefaultAsync(s => s.Id == id);
            if (supplier == null)
            {
                return NotFound();
            }
            return Ok(supplier.SupplierServiceTypes);
        }

        private bool SupplierExists(int id)
        {
            return _context.Suppliers.Any(e => e.Id == id);
        }
    }
}
