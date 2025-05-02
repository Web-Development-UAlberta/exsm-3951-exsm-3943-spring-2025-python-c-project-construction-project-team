using System.ComponentModel.DataAnnotations;

namespace RenovationStation.Models
{
    public class RFQStatus
    {
        [Key]
        public string? Status { get; set; }

        public ICollection<RFQ> RFQs { get; set; } = new List<RFQ>();
    }
}