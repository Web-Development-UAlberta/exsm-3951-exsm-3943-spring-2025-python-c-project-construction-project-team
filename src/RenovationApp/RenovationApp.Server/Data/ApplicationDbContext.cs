using  RenovationApp.Server.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;

namespace  RenovationApp.Server.Data
{
    public class ApplicationDbContext : IdentityDbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<ProjectStatus> ProjectStatuses { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Configure Vehicle entity
            builder.Entity<ProjectStatus>()
                .HasKey(s => s.Status);

            builder.Entity<ProjectStatus>()
                .Property(s => s.Status)
                .IsRequired()
                .HasMaxLength(50);
        }
    }
}
