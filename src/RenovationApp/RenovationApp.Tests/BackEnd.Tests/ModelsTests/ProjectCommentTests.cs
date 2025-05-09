
using System;
using System.ComponentModel.DataAnnotations;
using RenovationApp.Server.Models;
using Xunit;

namespace RenovationApp.Tests.Models
{
    public class ProjectCommentTests
    {
        [Fact]
        public void Comment_RequiredField_ShouldFailIfMissing()
        {
            var comment = new ProjectComment
            {
                Comment = null!,
                ProjectId = 1
            };

            var context = new ValidationContext(comment);
            var results = new System.Collections.Generic.List<ValidationResult>();
            var isValid = Validator.TryValidateObject(comment, context, results, true);

            Assert.False(isValid);
        }
    }
}
