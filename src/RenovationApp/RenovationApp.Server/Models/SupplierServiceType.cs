using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RenovationApp.Server.Models
{
    public class SupplierServiceType
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id", TypeName = "int")]
        public int Id { get; set; }

        [Column("supplier_id", TypeName = "int")]
        public int SupplierId { get; set; }

        [Column("service_type", TypeName = "varchar(100)")]
        public string ServiceType { get; set; } = string.Empty;

        // Navigation properties
        [ForeignKey(nameof(SupplierId))]
        public virtual Supplier Supplier { get; set; } = null!;

        [ForeignKey(nameof(ServiceType))]
        public virtual ProjectServiceType ProjectServiceType { get; set; } = null!;
    }
}
