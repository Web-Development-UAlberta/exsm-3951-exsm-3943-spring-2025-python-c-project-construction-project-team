
using System;
using System.ComponentModel.DataAnnotations;
using RenovationApp.Server.Models;
using Xunit;

namespace RenovationApp.Tests.Models
{
    public class ProjectServiceTests
    {
        [Fact]
        public void Service_Name_Required_ShouldFailIfMissing()
        {
            var service = new ProjectService
            {
                ProjectId = 1,
                Description = "Service description",
                QuotePrice = 15000,
                QuoteCost = 12000,
                QuoteStartDate = DateTime.UtcNow,
                QuoteEndDate = DateTime.UtcNow.AddDays(5)
            };

            var context = new ValidationContext(service);
            var results = new System.Collections.Generic.List<ValidationResult>();
            var isValid = Validator.TryValidateObject(service, context, results, true);

            Assert.False(isValid);
        }
    }
}
