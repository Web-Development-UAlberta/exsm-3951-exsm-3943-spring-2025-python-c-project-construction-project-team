using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RenovationApp.Server.Models
{
    public class ProjectStatus
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("status", TypeName = "text")]
        public string Status { get; set; } = string.Empty;

        // Fixed navigation property - this should reference Projects using this status
        [InverseProperty("ProjectStatus")]
        public virtual ICollection<Project> Projects { get; set; } = new List<Project>();
    }
}