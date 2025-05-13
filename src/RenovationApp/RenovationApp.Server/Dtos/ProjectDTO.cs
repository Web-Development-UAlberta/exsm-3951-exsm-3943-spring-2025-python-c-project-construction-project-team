using RenovationApp.Server.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace RenovationApp.Server.Dtos
{
    public class ProjectDTOs
    {
        public class ProjectCreateDTO
        {
            required public string ClientId { get; set; }
            public int? RFQId { get; set; }

        }
        public class ProjectUpdateDTO
        {
            public string? Status { get; set; }
            public bool IsPublic { get; set; }
            public decimal? QuotePriceOverride { get; set; }
            public DateTime? QuoteScheduleStartOverride { get; set; }
            public DateTime? QuoteScheduleEndOverride { get; set; }
            public string? RenovationType { get; set; }
        }
    }
}

