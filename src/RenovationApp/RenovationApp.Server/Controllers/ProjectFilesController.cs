using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RenovationApp.Server.Data;
using RenovationApp.Server.Models;

namespace RenovationApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectFilesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProjectFilesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/ProjectFiles
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProjectFile>>> GetProjectFiles()
        {
            return await _context.ProjectFiles.ToListAsync();
        }

        // GET: api/ProjectFiles/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProjectFile>> GetProjectFile(int id)
        {
            var projectFile = await _context.ProjectFiles.FindAsync(id);

            if (projectFile == null)
            {
                return NotFound();
            }

            return projectFile;
        }

        // PUT: api/ProjectFiles/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProjectFile(int id, ProjectFile projectFile)
        {
            if (id != projectFile.Id)
            {
                return BadRequest();
            }

            _context.Entry(projectFile).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProjectFileExists(id))
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

        // POST: api/ProjectFiles
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ProjectFile>> PostProjectFile(ProjectFile projectFile)
        {
            _context.ProjectFiles.Add(projectFile);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetProjectFile", new { id = projectFile.Id }, projectFile);
        }

        // DELETE: api/ProjectFiles/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProjectFile(int id)
        {
            var projectFile = await _context.ProjectFiles.FindAsync(id);
            if (projectFile == null)
            {
                return NotFound();
            }

            _context.ProjectFiles.Remove(projectFile);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProjectFileExists(int id)
        {
            return _context.ProjectFiles.Any(e => e.Id == id);
        }
    }
}
