using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace RenovationStation.Models
{
    public class UserRole
    {
        [Key]
        [Required]
        public string Name { get; set; }

        public string Description { get; set; }

        public ICollection<User> Users { get; set; }
    }
}
