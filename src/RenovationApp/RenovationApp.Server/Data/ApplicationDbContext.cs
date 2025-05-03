using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using RenovationApp.Server.Models;

namespace RenovationApp.Server.Data
{
    public class ApplicationDbContext : IdentityDbContext<User, IdentityRole<int>, int>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<ProjectStatus> ProjectStatuses { get; set; }

        public new DbSet<User> Users { get; set; }
        public new DbSet<UserRole> UserRoles { get; set; }
        public DbSet<RFQ> RFQs { get; set; }
        public DbSet<RFQStatus> RFQStatuses { get; set; }
        public DbSet<RFQImage> RFQImages { get; set; }
        public DbSet<RenovationType> RenovationTypes { get; set; }


        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.EnforceLowerCaseSchema();

            builder.Entity<ProjectStatus>()
                .HasKey(s => s.Status);

            builder.Entity<ProjectStatus>()
                .Property(s => s.Status)
                .IsRequired()
                .HasMaxLength(50);

            builder.Entity<User>()
                .HasOne(u => u.UserRole)
                .WithMany(r => r.Users)
                .HasForeignKey(u => u.Role)
                .HasPrincipalKey(r => r.Name)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<RFQ>()
                .HasOne(r => r.Client)
                .WithMany(u => u.RFQs)
                .HasForeignKey(r => r.ClientId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<RFQ>()
                .HasOne(r => r.AssignedEmployee)
                .WithMany()
                .HasForeignKey(r => r.AssignedEmployeeId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<RFQ>()
                .HasOne(r => r.RenovationTypeNavigation)
                .WithMany(rt => rt.RFQs)
                .HasForeignKey(r => r.RenovationType);

            builder.Entity<RFQ>()
                .HasOne(r => r.RFQStatus)
                .WithMany(s => s.RFQs)
                .HasForeignKey(r => r.Status);
        }
    }
}