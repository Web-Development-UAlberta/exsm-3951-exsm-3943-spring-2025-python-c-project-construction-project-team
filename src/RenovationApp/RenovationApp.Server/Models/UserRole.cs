using System.ComponentModel.DataAnnotations;

namespace RenovationApp.Server.Models
{
    public class UserRole
    {
        [Key]
        [Required]
        public string? Name { get; set; }

        [StringLength(100, ErrorMessage = "Description cannot exceed 100 characters.")]
        public string? Description { get; set; }

        public ICollection<User> Users { get; set; } = new List<User>();
    }
}