using System.ComponentModel.DataAnnotations;

namespace RenovationApp.Server.Models
{
    public class RFQStatus
    {
        [Key]
        [StringLength(30, ErrorMessage = "Status cannot exceed 30 characters.")]
        public string Status { get; set; } = string.Empty;

        public ICollection<RFQ> RFQs { get; set; } = new List<RFQ>();
    }
}