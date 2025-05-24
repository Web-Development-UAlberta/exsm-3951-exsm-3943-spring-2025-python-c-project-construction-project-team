using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RenovationApp.Server.Models
{
    public class ProjectServiceType
    {
        [Key]
        [Column("id", TypeName = "int")]
        public int Id { get; set; }

        [Column("name", TypeName = "varchar(100)")]
        public string? Name { get; set; }

        [Column("description", TypeName = "text")]
        public string? Description { get; set; }

        // Navigation Properties
        public ICollection<ProjectService>? ProjectServices { get; set; } = new List<ProjectService>();

    }
}