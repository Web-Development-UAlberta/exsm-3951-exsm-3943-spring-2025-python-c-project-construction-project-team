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
    public class ProjectTaskController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProjectTaskController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/ProjectTask
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProjectTask>>> GetProjectTasks()
        {
            return await _context.ProjectTasks.ToListAsync();
        }

        // GET: api/ProjectTask/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProjectTask>> GetProjectTask(int id)
        {
            var projectTask = await _context.ProjectTasks
                .Include(pt => pt.Project)
                .Include(pt => pt.AssignedUser)
                .FirstOrDefaultAsync(pt => pt.Id == id);

            if (projectTask == null)
            {
                return NotFound();
            }

            return projectTask;
        }

        // PUT: api/ProjectTask/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,ProjectManager")]
        public async Task<IActionResult> PutProjectTask(int id, ProjectTask projectTask)
        {
            if (id != projectTask.Id)
            {
                return BadRequest();
            }

            try
            {
                var existingTask = await _context.ProjectTasks.FindAsync(id);
                if (existingTask == null)
                {
                    return NotFound();
                }

                if (projectTask.ProjectId.HasValue)
                {
                    var project = await _context.Projects.FindAsync(projectTask.ProjectId.Value);
                    if (project == null)
                    {
                        return NotFound("Project not found.");
                    }
                }

                var user = await _context.Users.FindAsync(projectTask.AssignedUserId);
                if (user == null)
                {
                    return NotFound("User not found.");
                }

                existingTask.Title = projectTask.Title;
                existingTask.Description = projectTask.Description;
                existingTask.Status = projectTask.Status;
                existingTask.AssignedUserId = projectTask.AssignedUserId;
                existingTask.ProjectId = projectTask.ProjectId;

                _context.Entry(existingTask).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProjectTaskExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
        }

        // POST: api/ProjectTask
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ProjectTask>> CreateProjectTask(ProjectTask projectTask)
        {
            projectTask.CreatedTimestamp = DateTime.UtcNow;
            _context.ProjectTasks.Add(projectTask);
            await _context.SaveChangesAsync();

            await _context.Entry(projectTask)
                .Reference(pt => pt.Project)
                .LoadAsync();
            await _context.Entry(projectTask)
                .Reference(pt => pt.AssignedUser)
                .LoadAsync();

            return CreatedAtAction("GetProjectTask", new { id = projectTask.Id }, projectTask);
        }

        // DELETE: api/ProjectTask/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProjectTask(int id)
        {
            var projectTask = await _context.ProjectTasks.FindAsync(id);
            if (projectTask == null)
            {
                return NotFound();
            }

            _context.ProjectTasks.Remove(projectTask);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/ProjectTask/Project/5
        [HttpGet("Project/{projectId}")]
        public async Task<ActionResult<IEnumerable<ProjectTask>>> GetProjectTasksByProjectId(int projectId)
        {
            var projectTasks = await _context.ProjectTasks
                .Include(pt => pt.AssignedUser)
                .Where(pt => pt.ProjectId == projectId)
                .ToListAsync();
            if (projectTasks == null || !projectTasks.Any())
            {
                return NotFound();
            }
            return projectTasks;
        }

        // GET: api/ProjectTask/User/5
        [HttpGet("User/{userId}")]
        public async Task<ActionResult<IEnumerable<ProjectTask>>> GetProjectTasksByUserId(int userId)
        {
            var projectTasks = await _context.ProjectTasks
                .Include(pt => pt.Project)
                .Where(pt => pt.AssignedUserId == userId)
                .ToListAsync();
            if (projectTasks == null || !projectTasks.Any())
            {
                return NotFound();
            }
            return projectTasks;
        }

        // GET: api/ProjectTask/Status/{status}
        [HttpGet("Status/{status}")]
        public async Task<ActionResult<IEnumerable<ProjectTask>>> GetProjectTasksByStatus(string status)
        {
            var projectTasks = await _context.ProjectTasks
                .Include(pt => pt.Project)
                .Include(pt => pt.AssignedUser)
                .Where(pt => pt.Status == status)
                .ToListAsync();
            if (projectTasks == null || !projectTasks.Any())
            {
                return NotFound();
            }
            return projectTasks;
        }

        private bool ProjectTaskExists(int id)
        {
            return _context.ProjectTasks.Any(e => e.Id == id);
        }
    }
}
