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

        [Column("status", TypeName = "text")]
        public ProjectStatus? Status { get; set; }

        [Required]
        [Column("project_id", TypeName = "int")]
        public int ProjectId { get; set; }
        [ForeignKey(nameof(ProjectId))]
        public Project Project { get; set; } = null!;

        [Required]
        [Column("name", TypeName = "varchar(255)")]
        public string Name { get; set; } = string.Empty;

        [Required]
        [Column("description", TypeName = "text")]
        public string? Description { get; set; } = string.Empty;

        [Column("project_service_type_id", TypeName = "int")]
        public int? ProjectServiceTypeId { get; set; } 
        [ForeignKey(nameof(ProjectServiceTypeId))]
        public ProjectServiceType? ProjectServiceType { get; set; } 

        [Column("price_quote", TypeName = "decimal(10,2)")]
        public decimal? QuotePrice { get; set; }

        [Column("cost_quote", TypeName = "decimal(10,2)")]
        public decimal? QuoteCost { get; set; }

        [Column("start_date_quote", TypeName = "timestamp without time zone")]
        public DateTime QuoteStartDate { get; set; }

        [Column("end_date_quote", TypeName = "timestamp without time zone")]
        public DateTime QuoteEndDate { get; set; }

        [Column("start_date_actual", TypeName = "timestamp without time zone")]
        public DateTime? ActualStartDate { get; set; }

        [Column("end_date_actual", TypeName = "timestamp without time zone")]
        public DateTime? ActualEndDate { get; set; }

        // Navigation Properties
  
        [InverseProperty(nameof(ProjectServiceInvoice.ProjectService))]
        public virtual ICollection<ProjectServiceInvoice> ProjectServiceInvoices { get; set; } = new List<ProjectServiceInvoice>();
    }

}