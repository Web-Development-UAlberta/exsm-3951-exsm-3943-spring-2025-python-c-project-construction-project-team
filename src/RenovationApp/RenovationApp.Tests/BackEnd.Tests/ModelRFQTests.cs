using RenovationApp.Server.Data;
using RenovationApp.Server.Models;

namespace RenovationApp.Tests
{
    public class ModelRFQTests
    {
        private readonly DbContextOptions<ApplicationDbContext> _options;

        public ModelRFQTests()
        {
            _options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase("Test_RFQModel")
                .Options;
        }

        [Fact]
        public async Task CreateRFQ_ValidFields_PersistsToDatabase()
        {
            using var context = new ApplicationDbContext(_options);
            var rfq = new RFQ
            {
                CreatedTimestamp = DateTime.UtcNow,
                ClientId = 1,
                Status = "Submitted",
                AssignedEmployeeId = 2,
                PreferredMaterial = "Wood",
                Description = "Custom kitchen remodel with modern fixtures.",
                RenovationType = "Kitchen",
                Budget = 25000.50m,
                ProjectAddress = "123 Maple Ave",
                RoomSize = RoomSize.Medium
            };

            context.RFQs.Add(rfq);
            await context.SaveChangesAsync();

            var savedRFQ = await context.RFQs.FirstOrDefaultAsync();
            Assert.NotNull(savedRFQ);
            Assert.Equal("Wood", savedRFQ!.PreferredMaterial);
            Assert.Equal(RoomSize.Medium, savedRFQ.RoomSize);
        }

        [Fact]
        public async Task CreateRFQ_InvalidBudget_Throws()
        {
            using var context = new ApplicationDbContext(_options);
            var rfq = new RFQ
            {
                CreatedTimestamp = DateTime.UtcNow,
                ClientId = 1,
                Status = "Submitted",
                AssignedEmployeeId = 2,
                PreferredMaterial = "Wood",
                Description = "Demo",
                RenovationType = "Bathroom",
                Budget = -5000,
                ProjectAddress = "456 Oak Street",
                RoomSize = RoomSize.Small
            };

            context.RFQs.Add(rfq);
            await Assert.ThrowsAsync<DbUpdateException>(() => context.SaveChangesAsync());
        }
    }
}