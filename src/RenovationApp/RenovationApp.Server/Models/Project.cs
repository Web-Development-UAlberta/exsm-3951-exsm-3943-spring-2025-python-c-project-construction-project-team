using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RenovationApp.Server.Models
{
    public class Project
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id", TypeName = "int")]
        public int Id { get; set; }

        [Column("created_timestamp", TypeName = "timestamp without time zone")]
        public DateTime CreatedTimestamp { get; set; }

        [Required]
        [Column("created_by_employee")]
        public int CreatedByEmployee { get; set; }

        [ForeignKey(nameof(CreatedByEmployee))]
        [InverseProperty("ProjectEmployee")]
        public virtual User Employee { get; set; } = null!;

        [Required]
        [Column("client_id")]
        public int ClientId { get; set; }

        [ForeignKey(nameof(ClientId))]
        [InverseProperty("ProjectClient")]
        public virtual User Client { get; set; } = null!;

        [Column("status")]
        public ProjectStatus? Status { get; set; }

        [Required]
        [Column("is_public")]
        public bool IsPublic { get; set; }

        [Column("quote_price_override", TypeName = "decimal(10,2)")]
        public decimal? QuotePriceOverride { get; set; }

        [Column("quote_schedule_start_override", TypeName = "timestamp without time zone")]
        public DateTime? QuoteScheduleStartOverride { get; set; }

        [Column("quote_schedule_end_override", TypeName = "timestamp without time zone")]
        public DateTime? QuoteScheduleEndOverride { get; set; }

        // Navigation collections
        [InverseProperty("Project")]
        public virtual ICollection<ProjectComment> Comments { get; set; }

        [InverseProperty("Project")]
        public virtual ICollection<ProjectFile> Files { get; set; }

        [InverseProperty("Project")]
        public virtual ICollection<ProjectCommunication> Communications { get; set; }

        [InverseProperty("Project")]
        public virtual ICollection<ClientInvoice> ClientInvoices { get; set; }
        
        [InverseProperty("Project")]
        public ICollection<ProjectService> ProjectServices { get; set; } = new List<ProjectService>();

        [InverseProperty(nameof(ProjectTask.Project))]
        public virtual ICollection<ProjectTask> ProjectTasks { get; set; }

        // Constructor with default values
        public Project()
        {
            CreatedTimestamp = DateTime.UtcNow;
            IsPublic = false;

            // Initialize collections
            Comments = new List<ProjectComment>();
            Files = new List<ProjectFile>();
            Communications = new List<ProjectCommunication>();
            ClientInvoices = new List<ClientInvoice>();
            ProjectServices = new List<ProjectService>();
            ProjectTasks = new List<ProjectTask>();
        }
    }
}