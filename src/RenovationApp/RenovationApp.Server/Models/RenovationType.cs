using System.ComponentModel.DataAnnotations;

namespace RenovationApp.Server.Models
{
    public class RenovationType
    {
        [Key]
        [Required]
        public string? Name { get; set; }

        [StringLength(100, ErrorMessage = "Description cannot exceed 100 characters.")]
        public string? Description { get; set; }

        public ICollection<RFQ> RFQs { get; set; } = new List<RFQ>();
    }
}