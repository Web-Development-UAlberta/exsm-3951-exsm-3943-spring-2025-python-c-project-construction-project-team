using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RenovationApp.Server.Models
{
    public enum RoomSize
    {
        Small,
        Medium,
        Large,
        ExtraSpacious
    }
    public enum RFQStatus
    {
        Created,
        Quoted,
        Approved,
        Declined
    }

    public enum RenovationType
    {
        [Display(Name = "Kitchen Remodels")]
        KitchenRemodels,

        [Display(Name = "Bathroom Renovations")]
        BathroomRenovations,

        [Display(Name = "Basement Finishing")]
        BasementFinishing,

        [Display(Name = "Home Additions")]
        HomeAdditions
    }

    public class RFQ
    {
        [Key]
        [Column("id", TypeName = "int")]
        public int Id { get; set; }

        [Column("created_timestamp", TypeName = "timestamp without time zone")]
        public DateTime CreatedTimestamp { get; set; } = DateTime.UtcNow; // Default value

        [Required]
        [Column("client_id", TypeName = "int")]
        public int ClientId { get; set; }
        
        [ForeignKey(nameof(ClientId))]
        public virtual User Client { get; set; } = null!;

        [Column("status", TypeName = "text")]
        public RFQStatus? Status { get; set; }

        [Column("assigned_employee_id", TypeName = "int")]
        public int? AssignedEmployeeId { get; set; }

        [ForeignKey(nameof(AssignedEmployeeId))]
        public User? AssignedEmployee { get; set; }

        [StringLength(160, ErrorMessage = "Preferred Material cannot exceed 160 characters.")]
        public string? PreferredMaterial { get; set; }

        [StringLength(1000, ErrorMessage = "Renovation Description cannot exceed 1,000 characters.")]
        public string? Description { get; set; }

        [Column("renovation_type")]
        public RenovationType? RenovationType { get; set; }

        [Column("budget", TypeName = "decimal(9, 2)")]
        public decimal? Budget { get; set; }

        [StringLength(160)]
        public string? ProjectAddress { get; set; }

        public RoomSize? RoomSize { get; set; }

        public ICollection<RFQImage>? RFQImages { get; set; } = new List<RFQImage>();

        // Navigation to Project (optional cause it doesn't always has one)
        public Project? Project { get; set; }
    }
}