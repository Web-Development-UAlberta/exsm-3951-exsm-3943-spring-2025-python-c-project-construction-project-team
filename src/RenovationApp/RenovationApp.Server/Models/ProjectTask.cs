using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RenovationApp.Server.Models
{
    public class ProjectTask
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id", TypeName = "int")]
        public int Id { get; set; }

        [Column("created_timestamp", TypeName = "timestamp with time zone")]
        public DateTime CreatedTimestamp { get; set; } = DateTime.UtcNow; // Default value

        [Column("project_id", TypeName = "int")]
        public int? ProjectId { get; set; }

        [Column("user_id", TypeName = "varchar(255")]
        public string? UserId { get; set; }

        [Column("title", TypeName = "text")]
        [StringLength(100)]
        public string? Title { get; set; }

        [Column("description", TypeName = "text")]
        public string? Description { get; set; }
        [Column("status", TypeName = "text")]
        [StringLength(100)]
        public string? Status { get; set; }

        // Navigation properties
        [ForeignKey(nameof(ProjectId))]
        [InverseProperty(nameof(Project.ProjectTasks))]
        public virtual Project? Project { get; set; }
    }
}