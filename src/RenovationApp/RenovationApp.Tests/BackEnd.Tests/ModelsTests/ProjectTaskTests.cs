
using System;
using System.ComponentModel.DataAnnotations;
using RenovationApp.Server.Models;
using Xunit;

namespace RenovationApp.Tests.Models
{
    public class ProjectTaskTests
    {
        [Fact]
        public void Create_TaskWithTitle_Succeeds()
        {
            var task = new ProjectTask
            {
                Title = "Install Cabinets",
                ProjectId = 1,
                UserId = 2,
                Status = "Assigned"
            };

            var context = new ValidationContext(task);
            var results = new System.Collections.Generic.List<ValidationResult>();
            var isValid = Validator.TryValidateObject(task, context, results, true);

            Assert.True(isValid);
        }
    }
}
