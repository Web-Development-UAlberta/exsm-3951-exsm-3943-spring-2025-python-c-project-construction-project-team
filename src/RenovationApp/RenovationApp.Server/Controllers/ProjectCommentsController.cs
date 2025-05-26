using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RenovationApp.Server.Data;
using RenovationApp.Server.Models;
using static RenovationApp.Server.Dtos.ProjectCommentDTOs;

namespace RenovationApp.Server.Controllers
{
    [Route("projects/{projectId}/comments")]
    [ApiController]
    [Authorize(Policy = "projectManagersOnly")]
    public class ProjectCommentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProjectCommentsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/projects/{projectId}/comments
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProjectComment>>> GetProjectComments(int projectId)
        {
            var project = await _context.Projects.Include(p => p.Comments).FirstOrDefaultAsync(p => p.Id == projectId);
            if (project == null)
            {
                return NotFound();
            }

            return Ok(project.Comments);
        }

        // GET: api/projects/{projectId}/comments/{commentId}
        [HttpGet("{commentId}")]
        public async Task<ActionResult<ProjectComment>> GetProjectComment(int projectId, int commentId)
        {
            var projectComment = await _context.ProjectComments.FirstOrDefaultAsync(c => c.ProjectId == projectId && c.Id == commentId);

            if (projectComment == null)
            {
                return NotFound();
            }

            return projectComment;
        }

        // POST: api/projects/{projectId}/comments
        [HttpPost]
        public async Task<ActionResult<ProjectComment>> PostProjectComment(int projectId, ProjectCommentDTO projectCommentDTO)
        {
            string? userId = GetUserId(User);
            if (string.IsNullOrEmpty(userId))
            {
                return BadRequest("User ID is required.");
            }

            var newComment = new ProjectComment
            {
                CreatedByEmployee = userId,
                Comment = projectCommentDTO.Comment,
                CreatedTimestamp = DateTime.UtcNow,
                ProjectId = projectId
            };

            _context.ProjectComments.Add(newComment);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProjectComment), new { projectId = projectId, commentId = newComment.Id }, newComment);
        }

        // PUT: api/projects/{projectId}/comments/{commentId}
        [HttpPut("{commentId}")]
        public async Task<IActionResult> PutProjectComment(int projectId, int commentId, ProjectCommentDTO projectCommentDTO)
        {
            var projectComment = await _context.ProjectComments.FirstOrDefaultAsync(c => c.ProjectId == projectId && c.Id == commentId);
            if (projectComment == null)
            {
                return NotFound();
            }

            // Update the comment field from the DTO
            projectComment.Comment = projectCommentDTO.Comment;

            _context.Entry(projectComment).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProjectCommentExists(commentId))
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

        // DELETE: api/projects/{projectId}/comments/{commentId}
        [HttpDelete("{commentId}")]
        public async Task<IActionResult> DeleteProjectComment(int projectId, int commentId)
        {
            var projectComment = await _context.ProjectComments.FirstOrDefaultAsync(c => c.ProjectId == projectId && c.Id == commentId);
            if (projectComment == null)
            {
                return NotFound();
            }

            _context.ProjectComments.Remove(projectComment);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProjectCommentExists(int id)
        {
            return _context.ProjectComments.Any(e => e.Id == id);
        }
        private string? GetUserId(ClaimsPrincipal user)
        {
            return user.Claims.FirstOrDefault(c => c.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")?.Value;
        }
    }
}
