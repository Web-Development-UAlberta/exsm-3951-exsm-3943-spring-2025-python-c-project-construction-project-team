using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RenovationApp.Server.Models
{
    public enum FileType
    {
        image,
        document
    }
    public class ProjectFile
    {
        [Key]
        [Column("id", TypeName = "int")]
        public int Id { get; set; }

        [Column("uploaded_timestamp", TypeName = "timestamp with time zone")]
        public DateTime UploadedTimestamp { get; set; }

        [Column("file_uri", TypeName = "text")]
        public string FileUri { get; set; } = null!;

        [Column("file_name", TypeName = "text")]
        public string FileName { get; set; } = null!;

        [Column("type")]
        public FileType Type { get; set; }

        [Column("project_id")]
        public int ProjectId { get; set; }
        [ForeignKey(nameof(ProjectId))]
        [InverseProperty("Files")]
        public virtual Project Project { get; set; } = null!;
    }
}
