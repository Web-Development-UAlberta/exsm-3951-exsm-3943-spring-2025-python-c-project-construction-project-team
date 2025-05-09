using Microsoft.AspNetCore.Identity;
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
        public static async Task Initialize(IServiceProvider serviceProvider)
        {
            using var context = new ApplicationDbContext(
                serviceProvider.GetRequiredService<DbContextOptions<ApplicationDbContext>>());

            // Seed UserRoles
            if (!context.Users.Any())
            {
                context.Roles.AddRange(
                    new IdentityRole<int> { Name = "HomeOwner", NormalizedName = "HOMEOWNER" },
                    new IdentityRole<int> { Name = "ProjectManager", NormalizedName = "PROJECTMANAGER" },
                    new IdentityRole<int> { Name = "Admin", NormalizedName = "ADMIN" }
                );
            }
            
            // Seed RFQStatus and RenovationType enums
            if (!context.RFQs.Any())
            {
                context.RFQs.AddRange(
                    new RFQ {
                        CreatedTimestamp = DateTime.UtcNow,
                        ClientId = "1",
                        Status = RFQStatus.Created,
                        RenovationType = RenovationType.KitchenRemodels,
                        RoomSize = RoomSize.Small,
                    },
                    new RFQ {
                        CreatedTimestamp = DateTime.UtcNow,
                        ClientId = "2",
                        Status = RFQStatus.Quoted,
                        RenovationType = RenovationType.BathroomRenovations,
                        RoomSize = RoomSize.Medium,
                    },
                    new RFQ {
                        CreatedTimestamp = DateTime.UtcNow,
                        ClientId = "3",
                        Status = RFQStatus.Approved,
                        RenovationType = RenovationType.BasementFinishing,
                        RoomSize = RoomSize.Large,
                    },
                    new RFQ {
                        CreatedTimestamp = DateTime.UtcNow,
                        ClientId = "4",
                        Status = RFQStatus.Declined,
                        RenovationType = RenovationType.HomeAdditions,
                        RoomSize = RoomSize.ExtraSpacious,
                    }
                );
            }
            await context.SaveChangesAsync();
        }
    }
}