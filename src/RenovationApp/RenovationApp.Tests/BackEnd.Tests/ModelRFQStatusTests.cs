using RenovationApp.Server.Data;
using RenovationApp.Server.Models;

namespace RenovationApp.Tests
{
    public class ModelRFQStatusTests
    {
        private readonly DbContextOptions<ApplicationDbContext> _options;

        public ModelRFQStatusTests()
        {
            _options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase("Test_RFQStatusModel")
                .Options;
        }

        [Fact]
        public async Task SaveValidRFQStatus_Succeeds()
        {
            using var context = new ApplicationDbContext(_options);
            var status = new RFQStatus
            {
                Status = "In Review"
            };

            context.RFQStatuses.Add(status);
            await context.SaveChangesAsync();

            var saved = await context.RFQStatuses.FirstOrDefaultAsync();
            Assert.NotNull(saved);
            Assert.Equal("In Review", saved!.Status);
        }

        [Fact]
        public async Task SaveTooLongRFQStatus_Throws()
        {
            using var context = new ApplicationDbContext(_options);
            var longStatus = new string('A', 40); // exceeds 30 char limit

            var status = new RFQStatus
            {
                Status = longStatus
            };

            context.RFQStatuses.Add(status);
            await Assert.ThrowsAsync<DbUpdateException>(() => context.SaveChangesAsync());
        }
    }
}