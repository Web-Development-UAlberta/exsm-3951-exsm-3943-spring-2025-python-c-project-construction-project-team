using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RenovationApp.Server.Models
{
    public class ProjectComment
    {
        [Key]
        [Column("id", TypeName = "int")]
        public int Id { get; set; }

        [Column("comment", TypeName = "text")]
        public string Comment { get; set; } = null!;

        [Column("created_timestamp", TypeName = "timestamp without time zone")]
        public DateTime CreatedTimestamp { get; set; }

        [Column("created_by_employee")]
        public int CreatedByEmployee { get; set; }
        [ForeignKey(nameof(CreatedByEmployee))]
        public User? Employee { get; set; }

        [Column("project_id")]
        public int ProjectId { get; set; }
        [ForeignKey(nameof(ProjectId))]
        [InverseProperty("Comments")]
        public virtual Project Project { get; set; } = null!;
    }
}
