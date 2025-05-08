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
        public int? SupplierId { get; set; }
        [ForeignKey(nameof(SupplierId))]
        public Supplier? Supplier { get; set; }

        [Required]
        [ForeignKey(nameof(ProjectServiceType))]
        [Column("project_service_type_id", TypeName = "int")]
        public int ProjectServiceTypeId { get; set; }
        public ProjectServiceType ProjectServiceType { get; set; } = null!;
    }
}
