using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RenovationApp.Server.Models
{
    public class ProjectService
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id", TypeName = "int")]
        public int Id { get; set; }

        [Column("status", TypeName = "int")]
        public ProjectServiceStatus Status { get; set; }

        [Column("project_id", TypeName = "int")]
        public int? ProjectId { get; set; }

        [Required]
        [Column("name", TypeName = "varchar(255)")]
        public string Name { get; set; } = string.Empty;

        [Required]
        [Column("description", TypeName = "text")]
        public string Description { get; set; } = string.Empty;

        [Required]
        [Column("service_type", TypeName = "varchar(100)")]
        public string ServiceType { get; set; } = string.Empty;

        [Column("supplier_id", TypeName = "int")]
        public int? SupplierId { get; set; }

        [Column("price_quote", TypeName = "decimal(10,2)")]
        public decimal QuotePrice { get; set; }

        [Column("cost_quote", TypeName = "decimal(10,2)")]
        public decimal QuoteCost { get; set; }

        [Column("start_date_quote", TypeName = "datetime")]
        public DateTime QuoteStartDate { get; set; }

        [Column("end_date_quote", TypeName = "datetime")]
        public DateTime QuoteEndDate { get; set; }

        [Column("start_date_actual", TypeName = "datetime")]
        public DateTime ActualStartDate { get; set; }

        [Column("end_date_actual", TypeName = "datetime")]
        public DateTime ActualEndDate { get; set; }

        // Navigation properties
        [ForeignKey(nameof(ProjectId))]
        [InverseProperty(nameof(Project.ProjectServices))]
        public virtual Project? Project { get; set; }

        [ForeignKey(nameof(ServiceType))]
        public virtual ProjectServiceType ProjectServiceType { get; set; } = null!;

        [ForeignKey(nameof(SupplierId))]
        [InverseProperty(nameof(Supplier.ProjectServices))]
        public virtual Supplier? Supplier { get; set; } = null!;

        [InverseProperty(nameof(ProjectServiceInvoice.ProjectService))]
        public virtual ICollection<ProjectServiceInvoice> ProjectServiceInvoices { get; set; } = new List<ProjectServiceInvoice>();
    }
    public enum ProjectServiceStatus
    {
        Pending,
        InProgress,
        OnHold,
        Completed,
        Cancelled
    }
}