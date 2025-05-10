namespace RenovationApp.Server.DTOs
{
    public class ClientInvoiceDto
    {
        public int Id { get; set; }
        public DateTime CreatedTimestamp { get; set; }
        public string? Description { get; set; }
        public string? PaymentInstructions { get; set; }
        public DateTime? Paid { get; set; }
        public decimal? Amount { get; set; }
        public int? ProjectId { get; set; }
    }
}
