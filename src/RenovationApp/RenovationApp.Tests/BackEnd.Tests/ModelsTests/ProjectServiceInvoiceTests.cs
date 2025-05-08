
using System;
using System.ComponentModel.DataAnnotations;
using RenovationApp.Server.Models;
using Xunit;

namespace RenovationApp.Tests.Models
{
    public class ProjectServiceInvoiceTests
    {
        [Fact]
        public void Create_ValidServiceInvoice_Succeeds()
        {
            var invoice = new ProjectServiceInvoice
            {
                ProjectServiceId = 1,
                Amount = 999.99m,
                CreatedTimeStamp = DateTime.UtcNow
            };

            var context = new ValidationContext(invoice);
            var results = new System.Collections.Generic.List<ValidationResult>();
            var isValid = Validator.TryValidateObject(invoice, context, results, true);

            Assert.True(isValid);
        }
    }
}
