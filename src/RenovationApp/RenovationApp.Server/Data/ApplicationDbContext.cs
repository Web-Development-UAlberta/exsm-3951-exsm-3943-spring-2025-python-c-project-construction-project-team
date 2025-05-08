using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using RenovationApp.Server.Data.Configurations;
using RenovationApp.Server.Models;

namespace RenovationApp.Server.Data
{
    public class ApplicationDbContext : IdentityDbContext<User, IdentityRole<int>, int>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Project> Projects { get; set; } = null!;
        public DbSet<ProjectComment> ProjectComments { get; set; } = null!;
        public DbSet<ProjectFile> ProjectFiles { get; set; } = null!;
        public DbSet<ProjectCommunication> ProjectCommunications { get; set; } = null!;
        public DbSet<ClientInvoice> ClientInvoices { get; set; } = null!;
        public DbSet<ProjectService> ProjectServices { get; set; } = null!;
        public DbSet<ProjectServiceType> ProjectServiceTypes { get; set; } = null!;
        public DbSet<ProjectTask> ProjectTasks { get; set; } = null!;
        public DbSet<Supplier> Suppliers { get; set; } = null!;
        public DbSet<SupplierServiceType> SupplierServiceTypes { get; set; } = null!;
        public DbSet<RFQ> RFQs { get; set; } = null!;
        public DbSet<RFQImage> RFQImages { get; set; } = null!;
        public DbSet<ProjectServiceInvoice> ProjectServiceInvoices { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Apply all configurations
            modelBuilder.ApplyConfiguration(new ProjectFileConfiguration());
            
            // Configure enums to be stored as strings
            modelBuilder.Entity<Project>()
                .Property(e => e.Status)
                .HasConversion<string>();

            modelBuilder.Entity<ProjectService>()
                .Property(e => e.Status)
                .HasConversion<string>();

            modelBuilder.Entity<RFQ>()
                .Property(e => e.Status)
                .HasConversion<string>();

            modelBuilder.Entity<RFQ>()
                .Property(e => e.RenovationType)
                .HasConversion<string>();

            modelBuilder.Entity<RFQ>()
                .Property(e => e.RoomSize)
                .HasConversion<string>();

            modelBuilder.Entity<User>()
                .Property(e => e.Role)
                .HasConversion<string>();

            // Configure relationships

            // User and Project relationship
            modelBuilder.Entity<Project>()
                .HasOne(p => p.Employee)
                .WithMany(u => u.ProjectEmployee)
                .HasForeignKey(p => p.CreatedByEmployee)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Project>()
                .HasOne(p => p.Client)
                .WithMany(u => u.ProjectClient)
                .HasForeignKey(p => p.ClientId)
                .OnDelete(DeleteBehavior.Restrict);

            // RFQ relationships
            modelBuilder.Entity<RFQ>()
                .HasOne(r => r.Client)
                .WithMany(u => u.RFQs)
                .HasForeignKey(r => r.ClientId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<RFQ>()
                .HasOne(r => r.AssignedEmployee)
                .WithMany()
                .HasForeignKey(r => r.AssignedEmployeeId)
                .OnDelete(DeleteBehavior.Restrict);

            // ProjectComment relationship
            modelBuilder.Entity<ProjectComment>()
                .HasOne(pc => pc.Employee)
                .WithMany(u => u.Comments)
                .HasForeignKey(pc => pc.CreatedByEmployee)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ProjectComment>()
                .HasOne(pc => pc.Project)
                .WithMany(p => p.Comments)
                .HasForeignKey(pc => pc.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);

            // ProjectFile relationship
            modelBuilder.Entity<ProjectFile>()
                .HasOne(pf => pf.Project)
                .WithMany(p => p.Files)
                .HasForeignKey(pf => pf.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);

            // ProjectCommunication relationship
            modelBuilder.Entity<ProjectCommunication>()
                .HasOne(pc => pc.Project)
                .WithMany(p => p.Communications)
                .HasForeignKey(pc => pc.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);

            // ClientInvoice relationship
            modelBuilder.Entity<ClientInvoice>()
                .HasOne(ci => ci.Project)
                .WithMany(p => p.ClientInvoices)
                .HasForeignKey(ci => ci.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);

            // ProjectService relationships
            modelBuilder.Entity<ProjectService>()
                .HasOne(ps => ps.Project)
                .WithMany(p => p.ProjectServices)
                .HasForeignKey(ps => ps.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ProjectService>()
                .HasOne(ps => ps.ProjectServiceType)
                .WithMany(pst => pst.ProjectServices)
                .HasForeignKey(ps => ps.ProjectServiceTypeId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ProjectService>()
                .HasOne(ps => ps.Supplier)
                .WithMany(s => s.ProjectServices)
                .HasForeignKey(ps => ps.SupplierId)
                .OnDelete(DeleteBehavior.SetNull);

            // ProjectServiceInvoice relationship
            modelBuilder.Entity<ProjectServiceInvoice>()
                .HasOne(psi => psi.ProjectService)
                .WithMany(ps => ps.ProjectServiceInvoices)
                .HasForeignKey(psi => psi.ProjectServiceId)
                .OnDelete(DeleteBehavior.Cascade);

            // SupplierServiceType relationships
            modelBuilder.Entity<SupplierServiceType>()
                .HasOne(sst => sst.Supplier)
                .WithMany(s => s.SupplierServiceTypes)
                .HasForeignKey(sst => sst.SupplierId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<SupplierServiceType>()
                .HasOne(sst => sst.ProjectServiceType)
                .WithMany(pst => pst.SupplierServiceTypes)
                .HasForeignKey(sst => sst.ProjectServiceTypeId)
                .OnDelete(DeleteBehavior.Cascade);

            // ProjectTask relationships
            modelBuilder.Entity<ProjectTask>()
                .HasOne(pt => pt.Project)
                .WithMany(p => p.ProjectTasks)
                .HasForeignKey(pt => pt.ProjectId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<ProjectTask>()
                .HasOne(pt => pt.AssignedUser)
                .WithMany(u => u.ProjectTasks)
                .HasForeignKey(pt => pt.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // RFQImage relationship
            modelBuilder.Entity<RFQImage>()
                .HasOne(ri => ri.RFQ)
                .WithMany(r => r.RFQImages)
                .HasForeignKey(ri => ri.RFQId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure decimal precision for all decimal properties
            modelBuilder.Entity<RFQ>()
                .Property(r => r.Budget)
                .HasPrecision(9, 2);

            modelBuilder.Entity<ProjectService>()
                .Property(ps => ps.QuotePrice)
                .HasPrecision(10, 2);

            modelBuilder.Entity<ProjectService>()
                .Property(ps => ps.QuoteCost)
                .HasPrecision(10, 2);

            modelBuilder.Entity<ProjectServiceInvoice>()
                .Property(psi => psi.Amount)
                .HasPrecision(10, 2);

            modelBuilder.Entity<Project>()
                .Property(p => p.QuotePriceOverride)
                .HasPrecision(10, 2);

            modelBuilder.Entity<ClientInvoice>()
                .Property(ci => ci.Amount)
                .HasPrecision(10, 2);
        }
    }
}