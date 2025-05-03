using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RenovationApp.Models
{
    public class RFQImage
    {
        [Key]
        public int Id { get; set; }

        public DateTime UploadedTimestamp { get; set; }

        public string? ImageUri { get; set; }

        [ForeignKey("RFQ")]
        public int RfqId { get; set; }
        public RFQ RFQ { get; set; } = null!;
    }
}