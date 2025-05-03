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
        public DateTime CreatedTimeStamp { get; set; }

        [Column("project_id", TypeName = "int")]
        public int ProjectId { get; set; } // Foreign key to Project

        [Column("assigned_user_id", TypeName = "int")]
        public int AssignedUserId { get; set; } // Foreign key to User

        [Required]
        [Column("title", TypeName = "text")]
        [StringLength(100)]
        public string Title { get; set; }

        [Required]
        [Column("description", TypeName = "text")]
        public string Description { get; set; }

        [Required]
        [Column("status", TypeName = "text")]
        [StringLength(100)]
        public string Status { get; set; }

    }
}