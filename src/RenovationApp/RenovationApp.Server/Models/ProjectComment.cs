using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RenovationApp.Server.Models
{
    public class ProjectComment
    {
        [Key]
        [Column("id", TypeName = "int")]
        public int Id { get; set; }

        [Required]
        [Column("comment", TypeName = "text")]
        public string Comment { get; set; } = null!;

        [Column("created_timestamp", TypeName = "timestamp with time zone")]
        public DateTime CreatedTimestamp { get; set; } = DateTime.UtcNow; // Default value

        [Column("created_by_employee", TypeName = "varchar(255)")]
        required public string CreatedByEmployee { get; set; }


        [Column("project_id")]
        public int ProjectId { get; set; }
        [ForeignKey(nameof(ProjectId))]
        [InverseProperty("Comments")]
        public virtual Project Project { get; set; } = null!;
    }
}