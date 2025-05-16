namespace RenovationApp.Server.DTOs
{
    public class ProjectServiceCreateDTO
    {
        required public string Name { get; set; }
        public string? Description { get; set; }
        public int? ProjectServiceTypeId { get; set; }
        public decimal? QuotePrice { get; set; }
        public decimal? QuoteCost { get; set; }
        public DateTime QuoteStartDate { get; set; }
        public DateTime QuoteEndDate { get; set; }
        public DateTime? ActualStartDate { get; set; }
        public DateTime? ActualEndDate { get; set; }
        public string? Status { get; set; }
    }

    public class ProjectServiceUpdateDTO
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
        public int? ProjectServiceTypeId { get; set; }
        public decimal? QuotePrice { get; set; }
        public decimal? QuoteCost { get; set; }
        public DateTime? QuoteStartDate { get; set; }
        public DateTime? QuoteEndDate { get; set; }
        public DateTime? ActualStartDate { get; set; }
        public DateTime? ActualEndDate { get; set; }
        public string? Status { get; set; }
    }
}
