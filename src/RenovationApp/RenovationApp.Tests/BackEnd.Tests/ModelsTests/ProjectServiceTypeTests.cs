
using System;
using System.ComponentModel.DataAnnotations;
using RenovationApp.Server.Models;
using Xunit;

namespace RenovationApp.Tests.Models
{
    public class ProjectServiceTypeTests
    {
        [Fact]
        public void Create_ValidServiceType_Succeeds()
        {
            var type = new ProjectServiceType
            {
                Name = "Plumbing",
                Description = "Plumbing-related renovation services"
            };

            var context = new ValidationContext(type);
            var results = new System.Collections.Generic.List<ValidationResult>();
            var isValid = Validator.TryValidateObject(type, context, results, true);

            Assert.True(isValid);
        }
    }
}
