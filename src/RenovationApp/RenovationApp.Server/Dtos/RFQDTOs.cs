using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using RenovationApp.Server.Models;

namespace RenovationApp.Server.Dtos
{
    public class RFQDTOs
    {
        public class RFQEditDTO
        {
            public RFQStatus? Status { get; set; }
            public string? AssignedEmployeeId { get; set; }
            public string? PreferredMaterial { get; set; }
            public string? Description { get; set; }
            public RenovationType? RenovationType { get; set; }
            public decimal? Budget { get; set; }
            public string? ProjectAddress { get; set; }
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

        public class RFQOutputDTO
        {
            required public int Id { get; set; }
            public DateTime CreatedTimestamp { get; set; }
            required public string ClientId { get; set; }
            public string? Status { get; set; }

            public string? AssignedEmployeeId { get; set; }

            public string? PreferredMaterial { get; set; }

            public string? Description { get; set; }

            public string? RenovationType { get; set; }

            public decimal? Budget { get; set; }

            public string? ProjectAddress { get; set; }

            public string? RoomSize { get; set; }

            public int[]? RFQImages { get; set; }

            public int? Project { get; set; }

        }
    }
}

