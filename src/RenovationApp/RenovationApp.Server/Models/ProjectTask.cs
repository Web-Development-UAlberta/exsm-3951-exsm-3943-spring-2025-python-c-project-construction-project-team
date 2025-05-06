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

        [Column("created_timestamp", TypeName = "timestamp without time zone")]
        public DateTime CreatedTimestamp { get; set; }

        [Column("project_id", TypeName = "int")]
        public int? ProjectId { get; set; }

        [Column("assigned_user_id", TypeName = "int")]
        public int AssignedUserId { get; set; }

        [Required]
        [Column("title", TypeName = "text")]
        [StringLength(100)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [Column("description", TypeName = "text")]
        public string Description { get; set; } = string.Empty;

        [Required]
        [Column("status", TypeName = "text")]
        [StringLength(100)]
        public string Status { get; set; } = string.Empty;

        // Navigation properties
        [ForeignKey(nameof(ProjectId))]
        [InverseProperty(nameof(Project.ProjectTasks))]
        public virtual Project? Project { get; set; } = null!;

        [ForeignKey(nameof(AssignedUserId))]
        [InverseProperty(nameof(User.ProjectTasks))]
        public virtual User AssignedUser { get; set; } = null!;
    }
}