using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using RenovationApp.Server.Data;
using RenovationApp.Server.Models;
using Xunit;

namespace RenovationApp.Tests.Models
{
    public class RFQImageTests : IDisposable
    {
        private readonly ApplicationDbContext _context;

        public RFQImageTests()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase("Test_RFQImage_DB")
                .Options;

            _context = new ApplicationDbContext(options);

            _context.Users.AddRange(
                new User { Id = 1, Name = "Client A", Email = "client@example.com" },
                new User { Id = 2, Name = "Employee A", Email = "employee@example.com" }
            );

            _context.RFQs.Add(new RFQ
            {
                Id = 1,
                CreatedTimestamp = DateTime.UtcNow,
                ClientId = "1",
                AssignedEmployeeId = "2",
                Status = RFQStatus.Created,
                PreferredMaterial = "Brick",
                Description = "New RFQ request",
                RenovationType = RenovationType.KitchenRemodels,
                Budget = 7500,
                ProjectAddress = "101 Main St",
                RoomSize = RoomSize.Medium
            });

            _context.SaveChanges();
        }

        public void Dispose() => _context.Dispose();

        [Fact]
        public void Validate_RFQImage_ValidData_Succeeds()
        {
            var image = new RFQImage
            {
                RFQId = 1,
                FileName = "image.jpg",
                FilePath = "/images/image.jpg",
                UploadedAt = DateTime.UtcNow
            };

            var context = new ValidationContext(image);
            var results = new List<ValidationResult>();
            var isValid = Validator.TryValidateObject(image, context, results, true);

            Assert.True(isValid);
        }

        [Fact]
        public void Validate_RFQImage_MissingFileName_Fails()
        {
            var image = new RFQImage
            {
                RFQId = 1,
                FilePath = "/images/image.jpg",
                UploadedAt = DateTime.UtcNow,
                FileName = null!
            };

            var context = new ValidationContext(image);
            var results = new List<ValidationResult>();
            var isValid = Validator.TryValidateObject(image, context, results, true);

            Assert.False(isValid);
        }

        [Fact]
        public async Task SaveRFQImage_WithValidData_PersistsCorrectly()
        {
            var image = new RFQImage
            {
                RFQId = 1,
                FileName = "rfq_photo.jpg",
                FilePath = "/uploads/rfq_photo.jpg",
                UploadedAt = DateTime.UtcNow
            };

            _context.RFQImages.Add(image);
            await _context.SaveChangesAsync();

            var saved = await _context.RFQImages.FirstOrDefaultAsync(i => i.RFQId == 1);
            Assert.NotNull(saved);
            Assert.Equal("rfq_photo.jpg", saved!.FileName);
            Assert.StartsWith("/uploads", saved.FilePath);
        }
    }
}