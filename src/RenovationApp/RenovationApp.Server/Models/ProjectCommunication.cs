using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RenovationApp.Server.Models
{
    public class ProjectCommunication
    {
        [Key]
        [Column("id", TypeName = "int")]
        public int Id { get; set; }

        [Column("created_timestamp", TypeName = "timestamp without time zone")]
        public DateTime CreatedTimestamp { get; set; }

        [Column("message", TypeName = "text")]
        public string Message { get; set; } = null!;

        [Column("project_id")]
        public int ProjectId { get; set; }
        [ForeignKey(nameof(ProjectId))]
        [InverseProperty("Communications")]
        public virtual Project Project { get; set; } = null!;

        public ProjectCommunication()
        {
            CreatedTimestamp = DateTime.UtcNow;
        }
    }
}