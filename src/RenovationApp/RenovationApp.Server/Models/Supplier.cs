using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RenovationApp.Server.Models
{
    public class Supplier
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id", TypeName = "int")]
        public int Id { get; set; }

        [Required]
        [Column("name_business", TypeName = "varchar(255)")]
        public string BusinessName { get; set; } = string.Empty;

        [Required]
        [Column("name_salesman", TypeName = "varchar(255)")]
        public string SalesmanName { get; set; } = string.Empty;

        [Required]
        [Column("email", TypeName = "varchar(255)")]
        public string Email { get; set; } = string.Empty;

        [Required]
        [Column("phone_number", TypeName = "varchar(25)")]
        public string PhoneNumber { get; set; } = string.Empty;

        [Required]
        [Column("address", TypeName = "varchar(255)")]
        public string Address { get; set; } = string.Empty;

        // Navigation Properties
        public ICollection<ProjectService> ProjectServices { get; set; } = new List<ProjectService>();
        public ICollection<SupplierServiceType> SupplierServiceTypes { get; set; } = new List<SupplierServiceType>();
    }
}