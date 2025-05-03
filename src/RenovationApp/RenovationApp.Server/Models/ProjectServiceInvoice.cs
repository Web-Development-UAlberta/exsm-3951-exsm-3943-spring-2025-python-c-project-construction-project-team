using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RenovationApp.Server.Models
{
    public class ProjectServiceInvoice
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id", TypeName = "int")]
        public int Id { get; set; }

        [Column("created_timestamp", TypeName = "timestamp without time zone")]
        public DateTime CreatedTimeStamp { get; set; }

        [Column("service_id", TypeName = "int")]
        public int ProjectServiceId { get; set; }

        [Column("amount", TypeName = "decimal(10,2)")]
        public decimal Amount { get; set; }

        [Column("paid_at", TypeName = "timestamp without time zone")]
        public DateTime? Paid { get; set; }

        // Navigation properties

        [ForeignKey(nameof(ProjectServiceId))]
        [InverseProperty(nameof(ProjectService.ProjectServiceInvoices))]
        public virtual ProjectService? ProjectService { get; set; } = null!;
    }
}