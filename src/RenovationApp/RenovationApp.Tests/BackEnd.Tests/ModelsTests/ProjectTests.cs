
using System;
using System.ComponentModel.DataAnnotations;
using RenovationApp.Server.Models;
using Xunit;

namespace RenovationApp.Tests.Models
{
    public class ProjectTests
    {
        [Fact]
        public void Create_ValidProject_Succeeds()
        {
            var project = new Project
            {
                ClientId = 1,
                Status = ProjectStatus.Created,
                IsPublic = true
            };

            var context = new ValidationContext(project);
            var results = new System.Collections.Generic.List<ValidationResult>();
            var isValid = Validator.TryValidateObject(project, context, results, true);

            Assert.True(isValid);
        }

        [Fact]
        public void Create_Project_MissingClientId_ShouldFail()
        {
            var project = new Project
            {
                Status = ProjectStatus.InProgress,
                IsPublic = false
            };

            var context = new ValidationContext(project);
            var results = new System.Collections.Generic.List<ValidationResult>();
            var isValid = Validator.TryValidateObject(project, context, results, true);

            Assert.False(isValid);
            Assert.Contains(results, r => r.ErrorMessage != null && r.ErrorMessage.Contains("required"));
        }
    }
}
