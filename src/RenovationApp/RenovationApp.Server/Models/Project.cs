using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RenovationApp.Server.Models
{
    public enum ProjectStatus
    {
        [Display(Name = "New")]
        New,

        [Display(Name = "Quote Complete")]
        Quoted,

        [Display(Name = "Quote Approved")]
        QuoteApproved,

        [Display(Name = "In Progress")]
        InProgress,

        [Display(Name = "On Hold")]
        OnHold,

        [Display(Name = "Pending")]
        Pending,

        [Display(Name = "Completed")]
        Completed,

        [Display(Name = "Cancelled")]
        Cancelled
    }
    
       public enum RenovationTag
    {
        [Display(Name = "Modern")]
        modern,

        [Display(Name = "Rustic")]
        rustic,

        [Display(Name = "Country Style")]
        countrstyle,

        [Display(Name = "Luxury")]
        luxury
    }

    public class Project
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id", TypeName = "int")]
        public int Id { get; set; }

        [Column("created_timestamp", TypeName = "timestamp without time zone")]
        public DateTime? CreatedTimestamp { get; set; }

        [Column("created_by_employee", TypeName = "varchar(255)")]
        required public string CreatedByEmployee { get; set; }

        [Required]
        [Column("client_id", TypeName = "varchar(255)")]
        required public string ClientId { get; set; }

        [Column("rfq_id", TypeName = "int")]
        public int? RFQId { get; set; }

        [ForeignKey(nameof(RFQId))]
        public RFQ? RFQ { get; set; }

        [Column("status")]
        public ProjectStatus? Status { get; set; }

        [Column("is_public")]
        public bool IsPublic { get; set; }

        [Column("quote_price_override", TypeName = "decimal(10,2)")]
        public decimal? QuotePriceOverride { get; set; }

        [Column("quote_schedule_start_override", TypeName = "timestamp without time zone")]
        public DateTime? QuoteScheduleStartOverride { get; set; }

        [Column("quote_schedule_end_override", TypeName = "timestamp without time zone")]
        public DateTime? QuoteScheduleEndOverride { get; set; }

        [Column("renovation_type")]
        public RenovationType? RenovationType { get; set; }


        [Column("renovation_tags")]
        public RenovationTag[]? RenovationTags { get; set; }

        // Navigation collections
        [InverseProperty("Project")]
        public virtual ICollection<ProjectComment>? Comments { get; set; } = new List<ProjectComment>();

        [InverseProperty("Project")]
        public virtual ICollection<ProjectFile>? Files { get; set; } = new List<ProjectFile>();

        [InverseProperty("Project")]
        public virtual ICollection<ProjectCommunication>? Communications { get; set; } = new List<ProjectCommunication>();

        [InverseProperty("Project")]
        public virtual ICollection<ClientInvoice>? ClientInvoices { get; set; } = new List<ClientInvoice>();

        [InverseProperty("Project")]
        public ICollection<ProjectService>? ProjectServices { get; set; } = new List<ProjectService>();

        [InverseProperty(nameof(ProjectTask.Project))]
        public virtual ICollection<ProjectTask>? ProjectTasks { get; set; } = new List<ProjectTask>();

    }
}
