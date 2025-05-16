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
    [Route("[controller]")]
    [ApiController]
    [Authorize(Policy = "projectManagersOnly")]
    public class ProjectServiceTypesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProjectServiceTypesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/ProjectServiceTypes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProjectServiceType>>> GetProjectServiceTypes()
        {
            return await _context.ProjectServiceTypes.ToListAsync();
        }

        // GET: api/ProjectServiceTypes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProjectServiceType>> GetProjectServiceType(int id)
        {
            var projectServiceType = await _context.ProjectServiceTypes.FindAsync(id);

            if (projectServiceType == null)
            {
                return NotFound();
            }

            return projectServiceType;
        }

        // PUT: api/ProjectServiceTypes/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProjectServiceType(int id, ProjectServiceType projectServiceType)
        {
            if (id != projectServiceType.Id)
            {
                return BadRequest();
            }

            _context.Entry(projectServiceType).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProjectServiceTypeExists(id))
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

        // POST: api/ProjectServiceTypes
        [HttpPost]
        public async Task<ActionResult<ProjectServiceType>> PostProjectServiceType(ProjectServiceType projectServiceType)
        {
            _context.ProjectServiceTypes.Add(projectServiceType);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetProjectServiceType", new { id = projectServiceType.Id }, projectServiceType);
        }

        // DELETE: api/ProjectServiceTypes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProjectServiceType(int id)
        {
            var projectServiceType = await _context.ProjectServiceTypes.FindAsync(id);
            if (projectServiceType == null)
            {
                return NotFound();
            }

            _context.ProjectServiceTypes.Remove(projectServiceType);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProjectServiceTypeExists(int id)
        {
            return _context.ProjectServiceTypes.Any(e => e.Id == id);
        }
    }
}
