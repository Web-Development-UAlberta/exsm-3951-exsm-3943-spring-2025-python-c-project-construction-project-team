using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using RenovationApp.Server.Data;
using RenovationApp.Server.Models;
using System;
using System.Linq;

namespace RenovationApp.Server
{
    public static class SeedData
    {
        public static void Initialize(IServiceProvider serviceProvider)
        {
            using var context = new ApplicationDbContext(
                serviceProvider.GetRequiredService<DbContextOptions<ApplicationDbContext>>());

            // Seed UserRoles
            if (!context.UserRoles.Any())
            {
                context.UserRoles.AddRange(
                    new UserRole { Name = "Admin", Description = "Platform administrator with full access." },
                    new UserRole { Name = "ProjectManager", Description = "Manages renovation projects and tasks." },
                    new UserRole { Name = "Homeowner", Description = "Homeowner or client user role." }
                );
            }

            // Seed RFQStatuses
            if (!context.RFQStatuses.Any())
            {
                context.RFQStatuses.AddRange(
                    new RFQStatus { Status = "Pending" },
                    new RFQStatus { Status = "Reviewed" },
                    new RFQStatus { Status = "Approved" },
                    new RFQStatus { Status = "Rejected" },
                    new RFQStatus { Status = "Cancelled" }
                );
            }

            // Seed RenovationTypes
            if (!context.RenovationTypes.Any())
            {
                context.RenovationTypes.AddRange(
                    new RenovationType { Name = "Kitchen", Description = "Kitchen remodels and upgrades" },
                    new RenovationType { Name = "Bathroom", Description = "Bathroom renovations and plumbing" },
                    new RenovationType { Name = "Basement", Description = "Finished basements and suites" },
                    new RenovationType { Name = "Garage", Description = "Garage expansions and upgrades" },
                    new RenovationType { Name = "Sunroom", Description = "Sunroom additions and patios" }
                );
            }

            context.SaveChanges();
        }
    }
}