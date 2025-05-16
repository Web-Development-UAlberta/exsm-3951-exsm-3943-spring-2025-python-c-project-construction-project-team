
using System;
using System.ComponentModel.DataAnnotations;
using RenovationApp.Server.Models;
using Xunit;

namespace RenovationApp.Tests.Models
{
    public class ProjectCommunicationTests
    {
        [Fact]
        public void Create_ValidCommunication_Succeeds()
        {
            var communication = new ProjectCommunication
            {
                Message = "Site visit completed.",
                ProjectId = 1
            };

            var context = new ValidationContext(communication);
            var results = new System.Collections.Generic.List<ValidationResult>();
            var isValid = Validator.TryValidateObject(communication, context, results, true);

            Assert.True(isValid);
        }

        [Fact]
        public void Create_Communication_MissingMessage_ShouldFail()
        {
            var communication = new ProjectCommunication
            {
                Message = null!,
                ProjectId = 1
            };

            var context = new ValidationContext(communication);
            var results = new System.Collections.Generic.List<ValidationResult>();
            var isValid = Validator.TryValidateObject(communication, context, results, true);

            Assert.False(isValid);
        }
    }
}
