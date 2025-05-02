using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RenovationApp.Server.Models
{
    public class User
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        // Navigation collections with Project Model
        [InverseProperty("Employee")]
        public virtual ICollection<ProjectComment> Comments { get; set; } = new List<ProjectComment>();

        [InverseProperty("Employee")]
        public virtual ICollection<Project> ProjectEmployee { get; set; } = new List<Project>();

        [InverseProperty("Client")]
        public virtual ICollection<Project> ProjectClient { get; set; } = new List<Project>();


    }
}