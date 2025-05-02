using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RenovationStation.Models
{
    public enum RoomSize
    {
        Small,
        Medium,
        Large,
        ExtraSpacious
    }

    public class RFQ
    {
        [Key]
        public int Id { get; set; }

        public DateTime CreatedTimestamp { get; set; }

        [ForeignKey("Client")]
        public int ClientId { get; set; }
        public User Client { get; set; } = null!;

        [ForeignKey("Status")]
        public string? Status { get; set; }
        public RFQStatus RFQStatus { get; set; } = null!;

        [ForeignKey("AssignedEmployee")]
        public int? AssignedEmployeeId { get; set; }
        public User AssignedEmployee { get; set; } = null!;

        public string? PreferredMaterial { get; set; }

        public string? Description { get; set; }

        [ForeignKey("RenovationTypeNavigation")]
        public string? RenovationType { get; set; }
        public RenovationType RenovationTypeNavigation { get; set; } = null!;

        public decimal Budget { get; set; }

        public string? ProjectAddress { get; set; }

        public RoomSize RoomSize { get; set; }

        public ICollection<RFQImage> RFQImages { get; set; } = new List<RFQImage>();
    }
}