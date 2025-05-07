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
            return await _context.ProjectServiceInvoices.ToListAsync();
        }

        // GET api/ProjectServiceInvoice/5
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

        // POST api/ProjectServiceInvoice
        [HttpPost]
        public async Task<ActionResult<ProjectServiceInvoice>> PostProjectServiceInvoice(ProjectServiceInvoice projectServiceInvoice)
        {
            _context.ProjectServiceInvoices.Add(projectServiceInvoice);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (ProjectServiceInvoiceExists(projectServiceInvoice.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }
            return CreatedAtAction(nameof(GetProjectServiceInvoice), new { id = projectServiceInvoice.Id }, projectServiceInvoice);
        }

        // PUT api/ProjectServiceInvoice/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProjectServiceInvoice(int id, ProjectServiceInvoice updatedInvoice)
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

        private bool ProjectServiceInvoiceExists(int id)
        {
            return _context.ProjectServiceInvoices.Any(e => e.Id == id);
        }
    }
}
