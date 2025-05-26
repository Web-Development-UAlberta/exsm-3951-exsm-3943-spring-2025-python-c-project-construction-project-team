using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RenovationApp.Server.Models
{
    public class RFQImage
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string FileName { get; set; } = string.Empty;
        [Required]
        public string FilePath { get; set; } = string.Empty;
        public DateTime UploadedAt { get; set; } = DateTime.UtcNow; // Default value

        [Required]
        public string ImageUri { get; set; } = string.Empty;

        [ForeignKey("RFQ")]
        public int RFQId { get; set; }
        [Required]
        public RFQ RFQ { get; set; } = null!;
    }
}