using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.IO;
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
    [Authorize(Roles = "Admin,ProjectManager")]
    public class RFQController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public RFQController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/RFQ
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RFQ>>> GetRFQs()
        {
            return await _context.RFQs
                .Include(r => r.Client)
                .Include(r => r.AssignedEmployee)
                .Include(r => r.RFQStatus)
                .Include(r => r.RenovationType)
                .ToListAsync();
        }

        // GET: api/RFQ/5
        [HttpGet("{id}")]
        public async Task<ActionResult<RFQ>> GetRFQ(int id)
        {
            var rfq = await _context.RFQs
                .Include(r => r.Client)
                .Include(r => r.AssignedEmployee)
                .Include(r => r.RFQStatus)
                .Include(r => r.RFQImages)
                .Include(r => r.RenovationType)
                .FirstOrDefaultAsync(r => r.Id == id);
            if (rfq == null)
            {
                return NotFound();
            }
            return rfq;
        }

        // PUT: api/RFQ/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRFQ(int id, RFQ rfq)
        {
            if (id != rfq.Id)
            {
                return BadRequest();
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RFQExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error updating RFQ: {ex.Message}");
            }

            return NoContent();
        }

        // POST: api/RFQ
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<RFQ>> CreateRFQ(RFQ rfq)
        {
            rfq.CreatedTimestamp = DateTime.UtcNow;
            if (string.IsNullOrEmpty(rfq.Status))
            {
                rfq.Status = "New"; // Default status
            }

            _context.RFQs.Add(rfq);
            await _context.SaveChangesAsync();

            var createdRfq = await _context.RFQs
                .Include(r => r.Client)
                .Include(r => r.AssignedEmployee)
                .Include(r => r.RFQStatus)
                .Include(r => r.RenovationType)
                .FirstOrDefaultAsync(r => r.Id == rfq.Id);

            return CreatedAtAction(nameof(GetRFQ), new { id = rfq.Id }, createdRfq);
        }

        // DELETE: api/RFQ/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRFQ(int id)
        {
            var rfq = await _context.RFQs.FindAsync(id);
            if (rfq == null)
            {
                return NotFound();
            }

            _context.RFQs.Remove(rfq);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/RFQ/Client/5
        [HttpGet("Client/{clientId}")]
        public async Task<ActionResult<IEnumerable<RFQ>>> GetRFQsByClient(int clientId)
        {
            var rfqs = await _context.RFQs
                .Where(r => r.ClientId == clientId)
                .Include(r => r.RFQStatus)
                .Include(r => r.AssignedEmployee)
                .Include(r => r.RenovationType)
                .ToListAsync();
            if (rfqs == null || !rfqs.Any())
            {
                return NotFound();
            }
            return rfqs;
        }

        // GET: api/RFQ/Status/5
        [HttpGet("Status/{status}")]
        public async Task<ActionResult<IEnumerable<RFQ>>> GetRFQsByStatus(string status)
        {
            var rfqs = await _context.RFQs
                .Where(r => r.Status == status)
                .ToListAsync();
            if (rfqs == null || !rfqs.Any())
            {
                return NotFound();
            }
            return rfqs;
        }

        // GET: api/RFQ/RenovationType/5
        [HttpGet("RenovationType/{renovationTypeId}")]
        public async Task<ActionResult<IEnumerable<RFQ>>> GetRFQsByRenovationType(string renovationTypeId)
        {
            var rfqs = await _context.RFQs
                .Where(r => r.RenovationType == renovationTypeId)
                .ToListAsync();
            if (rfqs == null || !rfqs.Any())
            {
                return NotFound();
            }
            return rfqs;
        }

        // GET: api/RFQ/5/RFQImage
        [HttpGet("{id}/RFQImage")]
        public async Task<ActionResult<IEnumerable<RFQImage>>> GetRFQImages(int id)
        {
            var rfqImages = await _context.RFQImages
                .Where(ri => ri.RFQId == id)
                .ToListAsync();
            if (rfqImages == null || !rfqImages.Any())
            {
                return NotFound();
            }
            return rfqImages;
        }

        // PUT: api/RFQ/5/Status
        [HttpPut("{id}/Status")]
        [Authorize(Roles = "Admin,ProjectManager")]
        public async Task<IActionResult> UpdateRFQStatus(int id, [FromBody] string status)
        {
            try
            {
                var rfq = await _context.RFQs.FindAsync(id);
                if (rfq == null)
                {
                    return NotFound();
                }
                rfq.Status = status;
                _context.Entry(rfq).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error updating RFQ status.");
            }
        }

        // PUT: api/RFQ/5/AssignedEmployee
        [HttpPut("{id}/AssignedEmployee")]
        [Authorize(Roles = "Admin,ProjectManager")]
        public async Task<IActionResult> UpdateRFQAssignedEmployee(int id, [FromBody] int employeeId)
        {
            try
            {
                var rfq = await _context.RFQs.FindAsync(id);
                if (rfq == null)
                {
                    return NotFound();
                }

                var employee = await _context.Users
                    .FirstOrDefaultAsync(u => u.Id == employeeId && (u.Role == "Admin" || u.Role == "ProjectManager"));
                if (employee == null)
                {
                    return NotFound("Employee not found or does not have the required role.");
                }

                rfq.AssignedEmployeeId = employeeId;
                _context.Entry(rfq).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error updating RFQ assigned employee.");
            }
        }

        // POST: api/RFQ/5/Approve
        [HttpPost("{id}/Approve")]
        [Authorize(Roles = "Admin,ProjectManager")]
        public async Task<ActionResult<Project>> ApproveRFQAndCreateProject(int id, string initialComment)
        {
            try
            {
                var rfq = await _context.RFQs
                    .Include(r => r.Client)
                    .Include(r => r.RFQImages)
                    .FirstOrDefaultAsync(r => r.Id == id);
                if (rfq == null)
                {
                    return NotFound();
                }

                if (rfq.Status != "Accepted") // Accepted is when the RFQ is to be quoted.
                {
                    return BadRequest("RFQ is not in a state that can be approved.");
                }

                var project = new Project
                {
                    CreatedTimestamp = DateTime.UtcNow,
                    CreatedByEmployee = rfq.AssignedEmployeeId,
                    ClientId = rfq.ClientId,
                    StatusId = "Just Started",
                    IsPublic = false
                };

                _context.Projects.Add(project);
                await _context.SaveChangesAsync();

                // Update RFQ status
                rfq.Status = "Quoted";
                _context.Entry(rfq).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                // Transfer RFQ images to the new project
                if (rfq.RFQImages != null && rfq.RFQImages.Any())
                {
                    foreach (var image in rfq.RFQImages)
                    {
                        var fileExtension = Path.GetExtension(image.ImageUri).ToLower();
                        FileType fileType;

                        fileType = fileExtension switch
                        {
                            ".png" => FileType.PNG,
                            ".jpg" or ".jpeg" => FileType.JPG,
                            ".svg" => FileType.SVG,
                            ".doc" => FileType.DOC,
                            ".pdf" => FileType.PDF,
                            _ => FileType.PNG // Default to PNG for unsupported types
                        };

                        var projectFile = new ProjectFile
                        {
                            UploadedTimestamp = DateTime.UtcNow,
                            FileUri = image.ImageUri,
                            FileName = Path.GetFileName(image.ImageUri),
                            Type = fileType,
                            ProjectId = project.Id
                        };

                        _context.ProjectFiles.Add(projectFile);
                    }
                    await _context.SaveChangesAsync();
                }
                // Initial comment with reference to the RFQ
                var projectComment = new ProjectComment
                {
                    ProjectId = project.Id,
                    CreatedTimestamp = DateTime.UtcNow,
                    CreatedByEmployee = rfq.AssignedEmployeeId,
                    Comment = initialComment,
                };

                _context.ProjectComments.Add(projectComment);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetProject", "Project", new { id = project.Id }, project);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error approving RFQ and creating project: {ex.Message}");
            }
        }

        private bool RFQExists(int id)
        {
            return _context.RFQs.Any(e => e.Id == id);
        }
    }
}
