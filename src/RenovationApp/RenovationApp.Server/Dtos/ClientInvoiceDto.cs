using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RenovationApp.Server.Models
{
    public class ClientInvoiceDto
    {
        public string? Description { get; set; }
        public string? PaymentInstructions { get; set; }
        public DateTime? Paid { get; set; }
        public decimal? Amount { get; set; }

    }
}
