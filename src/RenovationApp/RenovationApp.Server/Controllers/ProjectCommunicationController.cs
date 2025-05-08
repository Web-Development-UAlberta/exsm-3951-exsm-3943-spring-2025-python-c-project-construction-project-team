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
    public class ProjectCommunicationController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProjectCommunicationController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/ProjectCommunication
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProjectCommunication>>> GetProjectCommunications()
        {
            return await _context.ProjectCommunications.ToListAsync();
        }

        // GET: api/ProjectCommunication/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProjectCommunication>> GetProjectCommunication(int id)
        {
            var projectCommunication = await _context.ProjectCommunications.FindAsync(id);

            if (projectCommunication == null)
            {
                return NotFound();
            }

            return projectCommunication;
        }

        // PUT: api/ProjectCommunication/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProjectCommunication(int id, ProjectCommunication projectCommunication)
        {
            if (id != projectCommunication.Id)
            {
                return BadRequest();
            }

            _context.Entry(projectCommunication).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProjectCommunicationExists(id))
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

        // POST: api/ProjectCommunication
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ProjectCommunication>> PostProjectCommunication(ProjectCommunication projectCommunication)
        {
            _context.ProjectCommunications.Add(projectCommunication);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetProjectCommunication", new { id = projectCommunication.Id }, projectCommunication);
        }

        private bool ProjectCommunicationExists(int id)
        {
            return _context.ProjectCommunications.Any(e => e.Id == id);
        }
    }
}
