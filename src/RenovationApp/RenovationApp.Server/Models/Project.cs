using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RenovationApp.Server.Models
{
    public class Project
    {
        [Key]
        [Column("id", TypeName = "int")]
        public int Id { get; set; }

        [Column("created_timestamp", TypeName = "timestamp without time zone")]
        public DateTime CreatedTimestamp { get; set; }

        [Column("created_by_employee")]
        public int CreatedByEmployee { get; set; }
        [ForeignKey(nameof(CreatedByEmployee))]
        [InverseProperty("ProjectEmployee")]
        public virtual User? Employee { get; set; }

        [Column("client_id")]
        public int ClientId { get; set; }
        [ForeignKey(nameof(ClientId))]
        [InverseProperty("ProjectClient")]
        public virtual User? Client { get; set; }

        [Column("status_id")]
        public int StatusId { get; set; }
        [ForeignKey(nameof(StatusId))]
        public virtual ProjectStatus ProjectStatus { get; set; } = null!;

        [Column("is_public")]
        public bool IsPublic { get; set; }

        [Column("quote_price_override")]
        public decimal? QuotePriceOverride { get; set; }

        [Column("quote_schedule_start_override", TypeName = "timestamp without time zone")]
        public DateTime? QuoteScheduleStartOverride { get; set; }

        [Column("quote_schedule_end_override", TypeName = "timestamp without time zone")]
        public DateTime? QuoteScheduleEndOverride { get; set; }

        // Navigation collections
        [InverseProperty("Project")]
        public virtual ICollection<ProjectComment> Comments { get; set; } = new List<ProjectComment>();

        [InverseProperty("Project")]
        public virtual ICollection<ProjectFile> Files { get; set; } = new List<ProjectFile>();

        [InverseProperty("Project")]
        public virtual ICollection<ProjectCommunication> Communications { get; set; } = new List<ProjectCommunication>();

        [InverseProperty("Project")]
        public virtual ICollection<ClientInvoice> ClientInvoices { get; set; } = new List<ClientInvoice>();
    }
}