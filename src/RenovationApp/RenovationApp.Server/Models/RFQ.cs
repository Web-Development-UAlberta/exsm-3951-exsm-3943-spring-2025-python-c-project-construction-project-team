using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RenovationApp.Models
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

        [StringLength(160, ErrorMessage = "Preferred Material cannot exceed 160 characters.")]
        public string? PreferredMaterial { get; set; }

        [StringLength(1000, ErrorMessage = "Renovation Description cannot exceed 1,000 characters.")]
        public string? Description { get; set; }

        [ForeignKey("RenovationTypeNavigation")]
        public string? RenovationType { get; set; }
        public RenovationType RenovationTypeNavigation { get; set; } = null!;
        
[Range(0, 1000000.00, ErrorMessage = "Budget must be between 0 and 1,000,000.00.")]
[Column(TypeName = "decimal(9, 2)")]
        public decimal Budget { get; set; }

        [StringLength(160, ErrorMessage = "Address cannot exceed 160 characters.")]
        public string? ProjectAddress { get; set; }

        public RoomSize RoomSize { get; set; }

        public ICollection<RFQImage> RFQImages { get; set; } = new List<RFQImage>();
    }
}