using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using RenovationApp.Server.Data.Configurations;
using RenovationApp.Server.Models;
using System.Reflection.Emit;

namespace RenovationApp.Server.Data
{
    public class ApplicationDbContext : IdentityDbContext<User, IdentityRole<int>, int>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public new DbSet<User> Users { get; set; }
        public new DbSet<UserRole> UserRoles { get; set; }
        public DbSet<RFQ> RFQs { get; set; }
        public DbSet<RFQStatus> RFQStatuses { get; set; }
        public DbSet<RFQImage> RFQImages { get; set; }
        public DbSet<RenovationType> RenovationTypes { get; set; }

        public DbSet<Project> Projects { get; set; } = null!;
        public DbSet<ProjectStatus> ProjectStatuses { get; set; }
        public DbSet<ProjectComment> ProjectComments { get; set; } = null!;
        public DbSet<ProjectFile> ProjectFiles { get; set; } = null!;
        public DbSet<ProjectCommunication> ProjectCommunications { get; set; } = null!;
        public DbSet<ProjectTask> ProjectTasks { get; set; } = null!;
        public DbSet<ProjectService> ProjectServices { get; set; } = null!;
        public DbSet<ProjectServiceType> ProjectServiceTypes { get; set; } = null!;
        public DbSet<Supplier> Suppliers { get; set; } = null!;
        public DbSet<SupplierServiceType> SupplierServiceTypes { get; set; } = null!;
        public DbSet<ProjectServiceInvoice> ProjectServiceInvoices { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Apply configurations
            builder.ApplyConfiguration(new ProjectFileConfiguration());
            builder.EnforceLowerCaseSchema();

            // Configuration User Relationships
            builder.Entity<User>()
                .HasOne(u => u.UserRole)
                .WithMany(r => r.Users)
                .HasForeignKey(u => u.Role)
                .HasPrincipalKey(r => r.Name)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<User>()
                .HasMany(u => u.ProjectEmployee)
                .WithOne(p => p.Employee)
                .HasForeignKey(p => p.CreatedByEmployee)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<User>()
                .HasMany(u => u.ProjectClient)
                .WithOne(p => p.Client)
                .HasForeignKey(p => p.ClientId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<User>()
                .HasMany(u => u.Comments)
                .WithOne(c => c.Employee)
                .HasForeignKey(c => c.CreatedByEmployee)
                .OnDelete(DeleteBehavior.Restrict);

            // Configuration RFQ Relationships
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

            builder.Entity<RFQStatus>()
                .HasKey(s => s.Status);
            builder.Entity<RFQStatus>()
                .Property(s => s.Status)
                .IsRequired()
                .HasMaxLength(30);

            // Configure Project relationships
            builder.Entity<Project>()
                .HasMany(p => p.Comments)
                .WithOne(c => c.Project)
                .HasForeignKey(c => c.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Project>()
                .HasMany(p => p.Files)
                .WithOne(f => f.Project)
                .HasForeignKey(f => f.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Project>()
                .HasMany(p => p.Communications)
                .WithOne(c => c.Project)
                .HasForeignKey(c => c.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Project>()
                .HasMany(p => p.ClientInvoices)
                .WithOne(i => i.Project)
                .HasForeignKey(i => i.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Project>()
                .HasOne(p => p.ProjectStatus)
                .WithMany(s => s.Projects)
                .HasForeignKey(p => p.StatusId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<ProjectStatus>()
                .HasKey(s => s.Status);

            builder.Entity<ProjectStatus>()
                .Property(s => s.Status)
                .IsRequired()
                .HasMaxLength(50);

            builder.Entity<ProjectTask>()
                .HasOne(pt => pt.Project)
                .WithMany(p => p.ProjectTasks)
                .HasForeignKey(pt => pt.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<ProjectTask>()
                .HasOne(pt => pt.AssignedUser)
                .WithMany(u => u.ProjectTasks)
                .HasForeignKey(pt => pt.AssignedUserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure Project Service relationships
            builder.Entity<ProjectService>()
                .HasOne(ps => ps.ProjectServiceType)
                .WithOne(pst => pst.ProjectService)
                .HasForeignKey<ProjectService>(ps => ps.ServiceType)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<ProjectService>()
                .HasOne(ps => ps.Supplier)
                .WithMany(s => s.ProjectServices)
                .HasForeignKey(ps => ps.SupplierId)
                .OnDelete(DeleteBehavior.ClientSetNull);

            builder.Entity<ProjectServiceInvoice>()
                .HasOne(psi => psi.ProjectService)
                .WithMany(ps => ps.ProjectServiceInvoices)
                .HasForeignKey(psi => psi.ProjectServiceId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<ProjectService>()
                .HasOne(ps => ps.Project)
                .WithMany(p => p.ProjectServices)
                .HasForeignKey(ps => ps.ProjectId)
                .OnDelete(DeleteBehavior.ClientSetNull);

            // Configure Supplier relationships
            builder.Entity<SupplierServiceType>()
                .HasOne(sst => sst.Supplier)
                .WithMany(s => s.SupplierServiceTypes)
                .HasForeignKey(sst => sst.SupplierId)
                .OnDelete(DeleteBehavior.Cascade);
            builder.Entity<SupplierServiceType>()
                .HasOne(sst => sst.ProjectServiceType)
                .WithMany(pst => pst.SupplierServiceTypes)
                .HasForeignKey(sst => sst.ServiceType)
                .OnDelete(DeleteBehavior.Cascade);
            builder.Entity<SupplierServiceType>()
                .HasIndex(sst => new { sst.SupplierId, sst.ServiceType })
                .IsUnique();

            // Configure table names to follow PostgreSQL conventions
            builder.Entity<User>().ToTable("users");
            builder.Entity<Project>().ToTable("projects");
            builder.Entity<ProjectStatus>().ToTable("project_statuses");
            builder.Entity<ProjectComment>().ToTable("project_comments");
            builder.Entity<ProjectFile>().ToTable("project_files");
            builder.Entity<ProjectCommunication>().ToTable("project_communications");
            builder.Entity<ClientInvoice>().ToTable("client_invoices");

            // Set up default values for CreatedTimestamp columns
            builder.Entity<Project>()
                .Property(p => p.CreatedTimestamp)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            builder.Entity<ProjectComment>()
                .Property(c => c.CreatedTimestamp)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            builder.Entity<ProjectFile>()
                .Property(f => f.UploadedTimestamp)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            builder.Entity<ProjectCommunication>()
                .Property(c => c.CreatedTimestamp)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            builder.Entity<ClientInvoice>()
                .Property(i => i.CreatedTimestamp)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            builder.Entity<ProjectService>()
                .Property(ps => ps.QuoteStartDate)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            builder.Entity<ProjectService>()
                .Property(ps => ps.QuoteEndDate)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            builder.Entity<ProjectService>()
                .Property(ps => ps.ActualStartDate)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            builder.Entity<ProjectService>()
                .Property(ps => ps.ActualEndDate)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            builder.Entity<ProjectTask>()
                .Property(pt => pt.CreatedTimestamp)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

        }
    }
}