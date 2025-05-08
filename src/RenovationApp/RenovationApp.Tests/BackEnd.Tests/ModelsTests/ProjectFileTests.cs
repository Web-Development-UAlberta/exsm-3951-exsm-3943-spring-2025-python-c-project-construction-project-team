
using System;
using System.ComponentModel.DataAnnotations;
using RenovationApp.Server.Models;
using Xunit;

namespace RenovationApp.Tests.Models
{
    public class ProjectFileTests
    {
        [Fact]
        public void Create_ValidProjectFile_Succeeds()
        {
            var file = new ProjectFile
            {
                FileUri = "/uploads/file.pdf",
                FileName = "file.pdf",
                Type = FileType.PDF,
                ProjectId = 1
            };

            var context = new ValidationContext(file);
            var results = new System.Collections.Generic.List<ValidationResult>();
            var isValid = Validator.TryValidateObject(file, context, results, true);

            Assert.True(isValid);
        }
    }
}
