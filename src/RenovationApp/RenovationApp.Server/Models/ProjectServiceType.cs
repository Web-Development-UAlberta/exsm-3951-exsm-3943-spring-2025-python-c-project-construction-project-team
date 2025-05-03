using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RenovationApp.Server.Models
{
    public class ProjectServiceType
    {
        [Key]
        [Column("name", TypeName = "varchar(100)")]
        public string Name { get; set; } = string.Empty;

        [Required]
        [Column("description", TypeName = "text")]
        public string Description { get; set; } = string.Empty;
    }
}