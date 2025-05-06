using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RenovationApp.Server.Models
{
    [Table("ProjectFiles")]
    public class ProjectFile
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [Column(TypeName = "character varying(50)")]
        required public string ProjectId { get; set; }

        [Required]
        [Column(TypeName = "character varying(20)")]
        required public string FileType { get; set; } // "image" or "file"

        [Required]
        [Column(TypeName = "character varying(255)")]
        required public string FileName { get; set; }

        [Column(TypeName = "text")]
        public string? Description { get; set; }

        [Required]
        [Column(TypeName = "character varying(255)")]
        required public string StorageKey { get; set; } // e.g., "project-123/image/uuid_filename.jpg"

        [Column(TypeName = "timestamp with time zone")]
        public DateTime UploadedTimestamp { get; set; }
    }
}
