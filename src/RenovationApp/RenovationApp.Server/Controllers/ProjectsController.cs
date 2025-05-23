﻿using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RenovationApp.Server.Data;
using RenovationApp.Server.Models;
using static RenovationApp.Server.Dtos.ProjectDTOs;

namespace RenovationApp.Server.Controllers
{
    [Route("/projects")]
    [ApiController]
    [Authorize]
    public class ProjectsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProjectsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Projects
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProjectOutputDTO>>> GetProjects()
        {
            string? UserId = GetUserId(User);
            if (string.IsNullOrEmpty(UserId))
            {
                return BadRequest("User ID is required.");
            }

            List<Project> projects;
            if (User.IsInRole("projectManager"))
            {
                projects = await _context.Projects
                    .Include(p => p.Comments)
                    .Include(p => p.Files)
                    .Include(p => p.Communications)
                    .Include(p => p.ClientInvoices)
                    .Include(p => p.ProjectServices!)
                        .ThenInclude(ps => ps.ProjectServiceType)
                    .Include(p => p.ProjectTasks)
                    .ToListAsync();
            }
            else
            {
                projects = await _context.Projects
                    .Where(project => project.ClientId == UserId)
                    .Include(p => p.Comments)
                    .Include(p => p.Files)
                    .Include(p => p.Communications)
                    .Include(p => p.ClientInvoices)
                    .Include(p => p.ProjectServices!)
                        .ThenInclude(ps => ps.ProjectServiceType)
                    .Include(p => p.ProjectTasks)
                    .ToListAsync();
            }

            var output = projects.Select(MapToOutputProject).ToList();
            return output;
        }

        // GET: api/Projects/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProjectOutputDTO>> GetProject(int id)
        {
            string? UserId = GetUserId(User);
            if (string.IsNullOrEmpty(UserId))
            {
                return BadRequest("User ID is required.");
            }

            var project = await _context.Projects
                .Include(p => p.Comments)
                .Include(p => p.Files)
                .Include(p => p.Communications)
                .Include(p => p.ClientInvoices)
                .Include(p => p.ProjectServices!)
                    .ThenInclude((System.Linq.Expressions.Expression<Func<ProjectService, ProjectServiceType?>>)(ps => ps.ProjectServiceType))
                .Include(p => p.ProjectTasks)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (project == null)
            {
                return NotFound();
            }

            if (project.ClientId != UserId && !User.IsInRole("projectManager"))
            {
                return Unauthorized();
            }

            return MapToOutputProject(project);
        }

        //PUT: api/Projects/5/ApproveQuote
        //Specifically for Clients to submit a status update to a project without exposing the rest of the project fields
        [HttpPut("{id}/ApproveQuote")]
        public async Task<IActionResult> ApproveProjectQuote(int id)
        {
           
            var project = await _context.Projects.FindAsync(id);
            if (project == null)
            {
                return NotFound();
            }

            if (project.ClientId != GetUserId(User) & !User.IsInRole("projectManager"))
            {
                return Unauthorized();
            }

            if (project.Status != ProjectStatus.Quoted)
            {
                return BadRequest("Project is not in a state to approve the quote.");
            }

            project.Status = ProjectStatus.QuoteApproved;

            _context.Entry(project).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProjectExists(id))
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



        // PUT: api/Projects/5
        [HttpPut("{id}")]
        [Authorize(Policy = "projectManagersOnly")]
        public async Task<IActionResult> PutProject(int id, ProjectUpdateDTO projectDTO)
        {
            var project = await _context.Projects.FindAsync(id);
            if (project == null)
            {
                return NotFound();
            }

            // Update fields only if they are provided in the DTO
            if (!string.IsNullOrEmpty(projectDTO.Status))
            {
                if (!Enum.TryParse<ProjectStatus>(projectDTO.Status, out var projectStatus))
                {
                    return BadRequest("Please specify an allowed project status.");
                }
                project.Status = projectStatus;
            }

            // Update fields only if they are provided in the DTO
            if (!string.IsNullOrEmpty(projectDTO.RenovationType))
            {
                if (!Enum.TryParse<RenovationType>(projectDTO.RenovationType, out var projectRenovationType))
                {
                    return BadRequest("Please specify an allowed renovation type.");
                }
                project.RenovationType = projectRenovationType;
            }

            if (projectDTO.IsPublic != default(bool))
            {
                project.IsPublic = projectDTO.IsPublic;
            }

            if (projectDTO.QuotePriceOverride.HasValue)
            {
                project.QuotePriceOverride = projectDTO.QuotePriceOverride.Value;
            }

            if (projectDTO.QuoteScheduleStartOverride.HasValue)
            {
                project.QuoteScheduleStartOverride = projectDTO.QuoteScheduleStartOverride.Value;
            }

            if (projectDTO.QuoteScheduleEndOverride.HasValue)
            {
                project.QuoteScheduleEndOverride = projectDTO.QuoteScheduleEndOverride.Value;
            }

            _context.Entry(project).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProjectExists(id))
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

        // POST: api/Projects
        [HttpPost]
        [Authorize(Policy = "projectManagersOnly")]
        public async Task<ActionResult<Project>> PostProject(ProjectCreateDTO projectCreate)
        {
            var newProject = new Project
            {
                CreatedByEmployee = GetUserId(User) ?? throw new InvalidOperationException("User ID is required."),
                ClientId = projectCreate.ClientId,
                RFQId = projectCreate.RFQId,
                Status = ProjectStatus.New,
                IsPublic = false
            };
            
            _context.Projects.Add(newProject);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetProject", new { id = newProject.Id }, newProject);
        }

        // DELETE: api/Projects/5
        [HttpDelete("{id}")]
        [Authorize(Policy = "projectManagersOnly")]
        public async Task<IActionResult> DeleteProject(int id)
        {
            var project = await _context.Projects.FindAsync(id);
            if (project == null)
            {
                return NotFound();
            }

            _context.Projects.Remove(project);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProjectExists(int id)
        {
            return _context.Projects.Any(e => e.Id == id);
        }
        private string? GetUserId(ClaimsPrincipal user)
        {
            return user.Claims.FirstOrDefault(c => c.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")?.Value;
        }

        // Mapping method for Project to ProjectOutputDTO
        private ProjectOutputDTO MapToOutputProject(Project project)
        {
            return new ProjectOutputDTO
            {
                Id = project.Id,
                Status = project.Status?.ToString(),
                RenovationType = project.RenovationType?.ToString(),
                RFQ = project.RFQId,
                Comments = project.Comments?.Select(c => new Project_OutCommentDTO
                {
                    Id = c.Id,
                    CreatedByEmployee = c.CreatedByEmployee,
                    Comment = c.Comment,
                    CreatedTimestamp = c.CreatedTimestamp
                }).ToList(),
                Files = project.Files?.Select(f => new Project_OutFileDTO
                {
                    Id = f.Id,
                    FileName = f.FileName,
                    Type = f.Type.ToString(),
                    FileUri = f.FileUri,
                    UploadedTimestamp = f.UploadedTimestamp
                }).ToList(),
                Communications = project.Communications?.Select(comm => new Project_OutCommunicationDTO
                {
                    Id = comm.Id,
                    Message = comm.Message,
                    CreatedTimestamp = comm.CreatedTimestamp
                }).ToList(),
                ClientInvoices = project.ClientInvoices?.Select(inv => new Project_OutClientInvoiceDTO
                {
                    Id = inv.Id,
                    Paid = inv.Paid
                }).ToList(),
                ProjectServices = project.ProjectServices?.Select(s => new Project_OutServiceDTO
                {
                    Id = s.Id,
                    Status = s.Status,
                    Name = s.Name,
                    ServiceTypeName = s.ProjectServiceType?.Name
                }).ToList(),
                ProjectTasks = project.ProjectTasks?.Select(t => new Project_OutTaskDTO
                {
                    Id = t.Id,
                    UserId = t.UserId,
                    Title = t.Title,
                    Status = t.Status
                }).ToList()
            };
        }
    }
}
