using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace RenovationApp.Server.Models
{
    public enum UserRole
    {
        [Display(Name = "Home Owner")]
        HomeOwner,

        [Display(Name = "Project Manager")]
        ProjectManager,

        [Display(Name = "Administrator")]
        Admin
    }
    public class User : IdentityUser<int>
    {
        // Id, email, and phone number are inherited from IdentityUser

        public Guid AuthenticationOid { get; set; }
        [Column("created_timestamp", TypeName = "timestamp without time zone")]
        public DateTime CreatedTimestamp { get; set; }
        [Required]
        [Column("name", TypeName = "varchar(255)")]
        public string Name { get; set; } = string.Empty;
        [Required]
        [Column("address", TypeName = "varchar(255)")]
        public string Address { get; set; } = string.Empty;
        [Required]
        [Column("role", TypeName = "varchar(50)")]
        public UserRole Role { get; set; }

        // Navigation collections with Project Model
        [InverseProperty("Client")]
        public virtual ICollection<RFQ>? RFQs { get; set; } = new List<RFQ>();

        [InverseProperty("Employee")]
        public virtual ICollection<ProjectComment>? Comments { get; set; } = new List<ProjectComment>();

        [InverseProperty("Employee")]
        public virtual ICollection<Project>? ProjectEmployee { get; set; } = new List<Project>();

        [InverseProperty("Client")]
        public virtual ICollection<Project>? ProjectClient { get; set; } = new List<Project>();

        [InverseProperty(nameof(ProjectTask.AssignedUser))]
        public virtual ICollection<ProjectTask>? ProjectTasks { get; set; } = new List<ProjectTask>();
    }
}