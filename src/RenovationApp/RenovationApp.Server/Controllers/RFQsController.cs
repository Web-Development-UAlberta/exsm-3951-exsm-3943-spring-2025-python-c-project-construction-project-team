using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RenovationApp.Server.Models;
using static RenovationApp.Server.Dtos.RFQDTOs;

namespace RenovationApp.Server.Data
{
    [Route("[controller]")]
    [ApiController]
    [Authorize]
    [Produces("application/json")]
    public class RFQsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public RFQsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/RFQs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RFQ>>> GetRFQs()
        {
            // Get the user's role and ID
            string? UserId = GetUserId(User);
            if (string.IsNullOrEmpty(UserId))
            {
                return BadRequest("User ID is required.");
            }

            if (User.IsInRole("projectManager"))
            {
                // Return only RFQs where the ClientId matches the user's ID
                return await _context.RFQs.ToListAsync();
            }
            else
            {
                // Return all RFQs
                return await _context.RFQs.Where(rfq => rfq.ClientId == UserId).ToListAsync();
            }

            // If the role is not recognized, return an empty list
            //return new List<RFQ>();
        }

        // GET: api/RFQs/5
        [HttpGet("{id}")]
        public async Task<ActionResult<RFQ>> GetRFQ(int id)
        {

            string? UserId = GetUserId(User);
            if (string.IsNullOrEmpty(UserId))
            {
                return BadRequest("User ID is required.");
            }
            var rFQ = await _context.RFQs.FindAsync(id);

            if (rFQ == null)
            {
                return NotFound();
            }

            if (rFQ.ClientId != UserId & !User.IsInRole("projectManager"))
            {
                return Unauthorized();
            }


            return rFQ;
        }

        // PUT: api/RFQs/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRFQ(int id, RFQEditDTO dto)
        {
            string? UserId = GetUserId(User);
            if (string.IsNullOrEmpty(UserId))
            {
                return BadRequest("User ID is required.");
            }

            var existingRFQ = await _context.RFQs.FindAsync(id);
            if (existingRFQ == null)
            {
                return NotFound("RFQ not found.");
            }

            if (existingRFQ.ClientId != UserId && !User.IsInRole("projectManager"))
            {
                return Unauthorized();
            }

            // Update only the provided fields
            if (dto.Status.HasValue)
            {
                if (!Enum.IsDefined(typeof(RFQStatus), dto.Status.Value))
                {
                    return BadRequest("Invalid RFQ status.");
                }
                existingRFQ.Status = dto.Status.Value;
            }

            if (!string.IsNullOrEmpty(dto.AssignedEmployeeId))
            {
                existingRFQ.AssignedEmployeeId = dto.AssignedEmployeeId;
            }

            if (!string.IsNullOrEmpty(dto.PreferredMaterial))
            {
                existingRFQ.PreferredMaterial = dto.PreferredMaterial;
            }

            if (!string.IsNullOrEmpty(dto.Description))
            {
                existingRFQ.Description = dto.Description;
            }

            if (dto.RenovationType.HasValue)
            {
                existingRFQ.RenovationType = dto.RenovationType.Value;
            }

            if (dto.Budget.HasValue)
            {
                existingRFQ.Budget = dto.Budget.Value;
            }

            if (!string.IsNullOrEmpty(dto.ProjectAddress))
            {
                existingRFQ.ProjectAddress = dto.ProjectAddress;
            }

            _context.Entry(existingRFQ).State = EntityState.Modified;

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

            return NoContent();
        }

        [HttpPost()]
        public async Task<ActionResult<RFQ>> PostRFQ(RFQCreateDTO rFQCreateDTO)
        {
            if (!Enum.TryParse<RenovationType>(rFQCreateDTO.RenovationType, out var renovationType))
            {
                return BadRequest("Please specify the correct renovation type");
            };

            string? UserId = GetUserId(User);
            if (string.IsNullOrEmpty(UserId))
            {
                return BadRequest("User ID is required.");
            }

            var rFQ = new RFQ
            {
                ClientId = UserId,
                RenovationType = renovationType,
                RoomSize = Enum.TryParse<RoomSize>(rFQCreateDTO.RoomSize, out var roomSize) ? roomSize : RoomSize.Small,
                PreferredMaterial = rFQCreateDTO.PreferredMaterial,
                Description = rFQCreateDTO.Description,
                Budget = rFQCreateDTO.Budget,
                ProjectAddress = rFQCreateDTO.ProjectAddress
            };
            _context.RFQs.Add(rFQ);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetRFQ", new { id = rFQ.Id }, rFQ);
        }

        private bool RFQExists(int id)
        {
            return _context.RFQs.Any(e => e.Id == id);
        }

        private string? GetUserId(ClaimsPrincipal user)
        {
            return user.Claims.FirstOrDefault(c => c.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")?.Value;
        }
    }
}
