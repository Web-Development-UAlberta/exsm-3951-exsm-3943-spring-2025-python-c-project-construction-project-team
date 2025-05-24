using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RenovationApp.Server.Data;
using RenovationApp.Server.DTOs;
using RenovationApp.Server.Models;

namespace RenovationApp.Server.Controllers
{
    [ApiController]
    [Route("projects/{projectId}/tasks")]
    [Authorize(Policy = "projectManagersOnly")]
    public class ProjectTaskController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProjectTaskController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/projects/{projectId}/tasks
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProjectTask>>> GetTasks(int projectId)
        {
            var project = await _context.Projects.FindAsync(projectId);
            if (project == null)
            {
                return NotFound("Project not found");
            }

            var tasks = await _context.ProjectTasks
                .Where(t => t.ProjectId == projectId)
                .ToListAsync();

            return tasks.Select(t => new ProjectTask
            {
                CreatedTimestamp = t.CreatedTimestamp,
                UserId = t.UserId,
                Title = t.Title,
                Description = t.Description,
                Status = t.Status
            }).ToList();
        }

        // GET: api/projects/{projectId}/tasks/{taskId}
        [HttpGet("{taskId}")]
        public async Task<ActionResult<ProjectTask>> GetTask(int projectId, int taskId)
        {
            var task = await _context.ProjectTasks
                .FirstOrDefaultAsync(t => t.ProjectId == projectId && t.Id == taskId);

            if (task == null)
            {
                return NotFound();
            }

            return new ProjectTask
            {
                CreatedTimestamp = task.CreatedTimestamp,
                UserId = task.UserId,
                Title = task.Title,
                Description = task.Description,
                Status = task.Status
            };
        }

        // POST: api/projects/{projectId}/tasks
        [HttpPost]
        public async Task<ActionResult<ProjectTaskDTO>> CreateTask(int projectId, ProjectTaskDTO dto)
        {
            var project = await _context.Projects.FindAsync(projectId);
            if (project == null)
            {
                return NotFound("Project not found");
            }

            var task = new ProjectTask
            {
                ProjectId = projectId,
                UserId = dto.UserId,
                Title = dto.Title,
                Description = dto.Description,
                Status = dto.Status,
                CreatedTimestamp = DateTime.UtcNow
            };

            _context.ProjectTasks.Add(task);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTask), new { projectId = projectId, taskId = task.Id }, new ProjectTaskDTO
            {
                UserId = task.UserId,
                Title = task.Title,
                Description = task.Description,
                Status = task.Status
            });
        }

        // PUT: api/projects/{projectId}/tasks/{taskId}
        [HttpPut("{taskId}")]
        public async Task<IActionResult> UpdateTask(int projectId, int taskId, ProjectTaskDTO dto)
        {
            var task = await _context.ProjectTasks
                .FirstOrDefaultAsync(t => t.ProjectId == projectId && t.Id == taskId);

            if (task == null)
            {
                return NotFound();
            }

            // Update fields only if they are provided in the DTO
            if (!string.IsNullOrEmpty(dto.UserId))
            {
                task.UserId = dto.UserId;
            }

            if (!string.IsNullOrEmpty(dto.Title))
            {
                task.Title = dto.Title;
            }

            if (!string.IsNullOrEmpty(dto.Description))
            {
                task.Description = dto.Description;
            }

            if (!string.IsNullOrEmpty(dto.Status))
            {
                task.Status = dto.Status;
            }

            _context.Entry(task).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TaskExists(taskId))
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

        // DELETE: api/projects/{projectId}/tasks/{taskId}
        [HttpDelete("{taskId}")]
        public async Task<IActionResult> DeleteTask(int projectId, int taskId)
        {
            var task = await _context.ProjectTasks
                .FirstOrDefaultAsync(t => t.ProjectId == projectId && t.Id == taskId);

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
    }
}