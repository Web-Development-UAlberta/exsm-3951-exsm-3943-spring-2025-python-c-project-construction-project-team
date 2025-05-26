
using System;
using System.ComponentModel.DataAnnotations;
using RenovationApp.Server.Models;
using Xunit;

namespace RenovationApp.Tests.Models
{
    public class ClientInvoiceTests
    {
        [Fact]
        public void Create_ValidClientInvoice_Succeeds()
        {
            var invoice = new ClientInvoice
            {
                Description = "Initial deposit",
                PaymentInstructions = "Wire transfer to account XYZ",
                Paid = null,
                Amount = 1200.50m,
                ProjectId = 1
            };

            var context = new ValidationContext(invoice);
            var results = new System.Collections.Generic.List<ValidationResult>();
            var isValid = Validator.TryValidateObject(invoice, context, results, true);

            Assert.True(isValid);
        }
    }
}
