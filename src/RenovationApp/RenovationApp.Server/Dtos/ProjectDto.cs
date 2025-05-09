using System;
using RenovationApp.Server.Models;

namespace RenovationApp.Server.DTOs
{
    public class ProjectDTO
    {
        public int Id { get; set; }
        public DateTime CreatedTimestamp { get; set; }
        public int? CreatedByEmployee { get; set; }
        public int ClientId { get; set; }
        public int? RFQId { get; set; }
        public ProjectStatus? Status { get; set; }
        public bool IsPublic { get; set; }
        public decimal? QuotePriceOverride { get; set; }
        public DateTime? QuoteScheduleStartOverride { get; set; }
        public DateTime? QuoteScheduleEndOverride { get; set; }
    
    }
}