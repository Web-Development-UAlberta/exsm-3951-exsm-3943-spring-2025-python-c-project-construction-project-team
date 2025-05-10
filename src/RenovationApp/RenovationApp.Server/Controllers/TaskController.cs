using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RenovationApp.Server.Data;
using RenovationApp.Server.Models;
using RenovationApp.Server.DTOs;
using RenovationApp.Server.Helpers;
using System.Security.Claims;

namespace RenovationApp.Server.Controllers
{
    [ApiController]
    [Route("/[controller]")]
    [Authorize]
    public class TaskController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TaskController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Task
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProjectTaskDTO>>> GetTasks()
        {
            var tasks = await _context.ProjectTasks
                .Include(t => t.Project)
                .Include(t => t.AssignedUser)
                .ToListAsync();

            return tasks.Select(t => t.ToDTO()).ToList();
        }

        // GET: api/Task/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProjectTaskDTO>> GetTask(int id)
        {
            var task = await _context.ProjectTasks
                .Include(t => t.Project)
                .Include(t => t.AssignedUser)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (task == null)
            {
                return NotFound();
            }

            return task.ToDTO();
        }

        // GET: api/Task/Project/5
        [HttpGet("Project/{projectId}")]
        public async Task<ActionResult<IEnumerable<ProjectTaskDTO>>> GetTasksByProject(int projectId)
        {
            var project = await _context.Projects.FindAsync(projectId);

            if (project == null)
            {
                return NotFound("Project not found");
            }

            var tasks = await _context.ProjectTasks
                .Where(t => t.ProjectId == projectId)
                .Include(t => t.AssignedUser)
                .ToListAsync();

            return tasks.Select(t => t.ToDTO()).ToList();
        }

        // POST: api/Task
        [HttpPost]
        public async Task<ActionResult<ProjectTaskDTO>> CreateTask(ProjectTaskDTO dto)
        {
            var task = dto.ToEntity();
            task.CreatedTimestamp = DateTime.UtcNow;

            _context.ProjectTasks.Add(task);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTask), new { id = task.Id }, task.ToDTO());
        }


        // PUT: api/Task/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(int id, ProjectTask task)
        {
            if (id != task.Id)
            {
                return BadRequest();
            }

            _context.Entry(task).State = EntityState.Modified;

            // Don't modify the creation timestamp
            _context.Entry(task).Property(x => x.CreatedTimestamp).IsModified = false;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TaskExists(id))
                {
                    return NotFound();
                }
                throw;
            }

            return NoContent();
        }


        // DELETE: api/Task/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            var task = await _context.ProjectTasks.FindAsync(id);
            if (task == null)
            {
                return NotFound();
            }

            _context.ProjectTasks.Remove(task);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TaskExists(int id)
        {
            return _context.ProjectTasks.Any(e => e.Id == id);
        }

        // We've moved the mapping logic to the DTOMapper class
    }
}