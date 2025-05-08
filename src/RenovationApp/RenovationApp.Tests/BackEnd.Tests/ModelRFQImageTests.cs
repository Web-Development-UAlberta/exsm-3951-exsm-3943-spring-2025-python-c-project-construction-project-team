using RenovationApp.Server.Data;
using RenovationApp.Server.Models;

namespace RenovationApp.Tests
{
    public class ModelRFQImageTests
    {
        private readonly DbContextOptions<ApplicationDbContext> _options;

        public ModelRFQImageTests()
        {
            _options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase("Test_RFQImageModel")
                .Options;
        }

        [Fact]
        public async Task SaveRFQImage_ValidData_SuccessfullyPersists()
        {
            using var context = new ApplicationDbContext(_options);

            context.RFQs.Add(new RFQ
            {
                Id = 1,
                CreatedTimestamp = DateTime.UtcNow,
                ClientId = 1,
                Status = "Submitted",
                AssignedEmployeeId = 2,
                PreferredMaterial = "Wood",
                Description = "Test RFQ",
                RenovationType = "Kitchen",
                Budget = 5000,
                ProjectAddress = "789 Birch Street",
                RoomSize = RoomSize.Small
            });
            await context.SaveChangesAsync();

            var image = new RFQImage
            {
                UploadedTimestamp = DateTime.UtcNow,
                ImageUri = "https://cdn.example.com/image1.jpg",
                RFQId = 1
            };

            context.RFQImages.Add(image);
            await context.SaveChangesAsync();

            var saved = await context.RFQImages.FirstOrDefaultAsync();
            Assert.NotNull(saved);
            Assert.Equal(1, saved!.RFQId);
            Assert.StartsWith("https://", saved.ImageUri);
        }

        [Fact]
        public async Task SaveRFQImage_MissingUri_StoresDefault()
        {
            using var context = new ApplicationDbContext(_options);

            context.RFQs.Add(new RFQ
            {
                Id = 2,
                CreatedTimestamp = DateTime.UtcNow,
                ClientId = 2,
                Status = "Submitted",
                AssignedEmployeeId = 2,
                PreferredMaterial = "Glass",
                Description = "Another test",
                RenovationType = "Bathroom",
                Budget = 10000,
                ProjectAddress = "321 Elm St",
                RoomSize = RoomSize.Medium
            });
            await context.SaveChangesAsync();

            var image = new RFQImage
            {
                UploadedTimestamp = DateTime.UtcNow,
                RFQId = 2
                // ImageUri will use default empty string
            };

            context.RFQImages.Add(image);
            await context.SaveChangesAsync();

            var saved = await context.RFQImages.FirstOrDefaultAsync(i => i.RFQId == 2);
            Assert.NotNull(saved);
            Assert.Equal(string.Empty, saved!.ImageUri);
        }
    }
}