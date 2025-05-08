using RenovationApp.Server.Data;
using RenovationApp.Server.Models;

namespace RenovationApp.Tests
{
    public class UserRoleTests
    {
        private readonly DbContextOptions<ApplicationDbContext> _options;

        public UserRoleTests()
        {
            _options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase("Test_UserRoleModel")
                .Options;
        }

        [Fact]
        public async Task AddUserRole_ValidRole_SavesSuccessfully()
        {
            using var context = new ApplicationDbContext(_options);
            var role = new UserRole
            {
                Name = "ProjectManager",
                Description = "Handles assigned projects"
            };

            context.UserRoles.Add(role);
            await context.SaveChangesAsync();

            var saved = await context.UserRoles.FirstOrDefaultAsync();
            Assert.NotNull(saved);
            Assert.Equal("ProjectManager", saved!.Name);
        }

        [Fact]
        public async Task AddDuplicateUserRole_ThrowsException()
        {
            using var context = new ApplicationDbContext(_options);
            context.UserRoles.Add(new UserRole { Name = "Admin" });
            await context.SaveChangesAsync();

            var duplicate = new UserRole { Name = "Admin" };
            context.UserRoles.Add(duplicate);

            await Assert.ThrowsAsync<DbUpdateException>(() => context.SaveChangesAsync());
        }
    }
}