using RenovationApp.Server.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace RenovationApp.Server.Dtos
{
    public class ProjectDTOs
    {
        public class ProjectCreateDTO
        {
            required public string ClientId { get; set; }
            public int? RFQId { get; set; }
            public List<RenovationTag>? RenovationTags { get; set; }
        }
        public class ProjectUpdateDTO
        {
            public string? Status { get; set; }
            public bool IsPublic { get; set; }
            public decimal? QuotePriceOverride { get; set; }
            public DateTime? QuoteScheduleStartOverride { get; set; }
            public DateTime? QuoteScheduleEndOverride { get; set; }
            public string? RenovationType { get; set; }
            public List<RenovationTag>? RenovationTags { get; set; }
        }

        public class ProjectPublicInfo
        {
            public int Id { get; set; }
            public RenovationType? RenovationType { get; set; }
            public decimal Cost { get; set; }
            public List<RenovationTag>? RenovationTags { get; set; }
        }

        public class ProjectOutputDTO
        {
            public int Id { get; set; }
            public string? Status { get; set; }
            public string? RenovationType { get; set; }
            public int? RFQ { get; set; }
            public List<Project_OutCommentDTO>? Comments { get; set; }
            public List<Project_OutFileDTO>? Files { get; set; }
            public List<Project_OutCommunicationDTO>? Communications { get; set; }
            public List<Project_OutClientInvoiceDTO>? ClientInvoices { get; set; }
            public List<Project_OutServiceDTO>? ProjectServices { get; set; }
            public List<Project_OutTaskDTO>? ProjectTasks { get; set; }
        }

        public class Project_OutCommentDTO
        {
            public int Id { get; set; }
            public string? CreatedByEmployee { get; set; }
            public string? Comment { get; set; }
            public DateTime CreatedTimestamp { get; set; }
        }

        public class Project_OutFileDTO
        {
            public int Id { get; set; }
            public string FileName { get; set; } = null!;
            public string Type { get; set; } = null!;
            public string FileUri { get; set; } = null!;
            public DateTime UploadedTimestamp { get; set; }
        }

        public class Project_OutCommunicationDTO
        {
            public int Id { get; set; }
            public string? Message { get; set; }
            public DateTime CreatedTimestamp { get; set; }
        }

        public class Project_OutClientInvoiceDTO
        {
            public int Id { get; set; }
            public DateTime? Paid { get; set; }
        }

        public class Project_OutServiceDTO
        {
            public int Id { get; set; }
            public string? Status { get; set; }
            public string Name { get; set; } = null!;
            public string? ServiceTypeName { get; set; }
        }

        public class Project_OutTaskDTO
        {
            public int Id { get; set; }
            public string? UserId { get; set; }
            public string? Title { get; set; }
            public string? Status { get; set; }
        }
    }
}

