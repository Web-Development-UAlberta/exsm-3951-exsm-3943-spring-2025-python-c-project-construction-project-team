using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RenovationApp.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [Column(TypeName = "uuid")]
        public Guid AuthenticationOid { get; set; }

        [Required]
        public DateTime CreatedTimestamp { get; set; }

        [Required]
        public string? Name { get; set; }

        [EmailAddress]
        public string? Email { get; set; }

        [Required]
        [ForeignKey(nameof(UserRole))]
        public string? Role { get; set; }

        public string? PhoneNumber { get; set; }

        [StringLength(160, ErrorMessage = "Preferred Material cannot exceed 160 characters.")]
        public string? Address { get; set; }

        public UserRole UserRole { get; set; } = null!;

        public ICollection<RFQ> RFQs { get; set; } = new List<RFQ>();
    }
}