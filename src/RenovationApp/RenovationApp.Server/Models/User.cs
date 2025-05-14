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

    }
}