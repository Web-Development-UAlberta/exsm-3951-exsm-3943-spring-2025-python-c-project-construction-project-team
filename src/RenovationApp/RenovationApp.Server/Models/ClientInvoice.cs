using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RenovationApp.Server.Models
{
    public class ClientInvoice
    {
        [Key]
        [Column("id", TypeName = "int")]
        public int Id { get; set; }

        [Column("created_timestamp", TypeName = "timestamp with time zone")]
        public DateTime CreatedTimestamp { get; set; } = DateTime.UtcNow; // Default value

        [Column("description", TypeName = "text")]
        public string? Description { get; set; } 

        [Column("payment_instructions", TypeName = "text")]
        public string? PaymentInstructions { get; set; } 

        [Column("paid", TypeName = "timestamp with time zone")]
        public DateTime? Paid { get; set; } 

        [Column("amount", TypeName = "decimal")]
        public decimal? Amount { get; set; } 

        [Column("project_id")]
        public int? ProjectId { get; set; } 
        [ForeignKey(nameof(ProjectId))]
        [InverseProperty("ClientInvoices")]
        public virtual Project? Project { get; set; } 
    }
}
