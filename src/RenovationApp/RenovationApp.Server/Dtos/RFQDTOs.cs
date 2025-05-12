using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using RenovationApp.Server.Models;

namespace RenovationApp.Server.Dtos
{
    public class RFQDTOs
    {
        public class RFQDTO
        {
            public int Id { get; set; }
            public DateTime CreatedTimestamp { get; set; } // Default value
            public required string ClientId { get; set; }
            public RFQStatus? Status { get; set; }
            public string? AssignedEmployeeId { get; set; }
            public string? PreferredMaterial { get; set; }
            public string? Description { get; set; }
            public RenovationType? RenovationType { get; set; }
            public decimal? Budget { get; set; }
            public string? ProjectAddress { get; set; }
            public ICollection<RFQImage>? RFQImages { get; set; }
            public Project? Project { get; set; }
        }
        public class RFQCreateDTO
        {
            public string? RenovationType { get; set; }
            public string RoomSize { get; set; } = null!;
            public string? PreferredMaterial { get; set; }
            public string? Description { get; set; }
            public decimal? Budget { get; set; }
            public string? ProjectAddress { get; set; }

        }
    }
}
