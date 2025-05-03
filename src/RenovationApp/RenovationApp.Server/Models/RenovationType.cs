using System.ComponentModel.DataAnnotations;

namespace RenovationApp.Server.Models
{
    public class RenovationType
    {
        [Key]
        [Required]
        public string Name { get; set; } = string.Empty;

        [StringLength(100, ErrorMessage = "Description cannot exceed 100 characters.")]
        public string Description { get; set; } = string.Empty;

        public virtual ICollection<RFQ> RFQs { get; set; } = new List<RFQ>();
    }
}