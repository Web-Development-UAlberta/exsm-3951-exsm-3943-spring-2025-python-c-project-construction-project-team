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
    [ApiController]
    [Route("/[controller]")]
    //[Authorize]
    public class ProjectStatusController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProjectStatusController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/ProjectStatus
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProjectStatus>>> GetProjectStatuses()
        {
            return await _context.ProjectStatuses.ToListAsync();
        }

        // GET: api/ProjectStatus/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProjectStatus>> GetProjectStatus(string id)
        {
            var projectStatus = await _context.ProjectStatuses.FindAsync(id);

            if (projectStatus == null)
            {
                return NotFound();
            }

            return projectStatus;
        }

        // PUT: api/ProjectStatus/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProjectStatus(string id, ProjectStatus projectStatus)
        {
            if (id != projectStatus.Status)
            {
                return BadRequest();
            }

            _context.Entry(projectStatus).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProjectStatusExists(id))
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

        // POST: api/ProjectStatus
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ProjectStatus>> PostProjectStatus(ProjectStatus projectStatus)
        {
            _context.ProjectStatuses.Add(projectStatus);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (ProjectStatusExists(projectStatus.Status))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetProjectStatus", new { id = projectStatus.Status }, projectStatus);
        }

        // DELETE: api/ProjectStatus/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProjectStatus(string id)
        {
            var projectStatus = await _context.ProjectStatuses.FindAsync(id);
            if (projectStatus == null)
            {
                return NotFound();
            }

            _context.ProjectStatuses.Remove(projectStatus);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProjectStatusExists(string id)
        {
            return _context.ProjectStatuses.Any(e => e.Status == id);
        }
    }
}
