using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RenovationApp.Server.Models
{
    public class User : IdentityUser<int>
    {
        [Required]
        [Column(TypeName = "uuid")]
        public Guid AuthenticationOid { get; set; }

        [Required]
        public DateTime CreatedTimestamp { get; set; }

        [Required]
        public string Name { get; set; } = null!;

        [Required]
        [ForeignKey(nameof(UserRole))]
        public string Role { get; set; } = null!;
        public UserRole UserRole { get; set; } = null!;
        
        [StringLength(160, ErrorMessage = "Address cannot exceed 160 characters.")]
        public string? Address { get; set; }

        public ICollection<RFQ> RFQs { get; set; } = new List<RFQ>();
    }
}