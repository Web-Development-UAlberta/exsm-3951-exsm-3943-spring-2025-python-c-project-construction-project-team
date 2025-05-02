using Microsoft.EntityFrameworkCore;
using RenovationApp.Server.Data.Configurations;
using RenovationApp.Server.Models;

namespace RenovationApp.Server.Data
{
    public class RenovationContext : DbContext
    {
        public RenovationContext(DbContextOptions<RenovationContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Project> Projects { get; set; } = null!;
        public DbSet<ProjectStatus> ProjectStatuses { get; set; } = null!;
        public DbSet<ProjectComment> ProjectComments { get; set; } = null!;
        public DbSet<ProjectFile> ProjectFiles { get; set; } = null!;
        public DbSet<ProjectCommunication> ProjectCommunications { get; set; } = null!;
        public DbSet<ClientInvoice> ClientInvoices { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Apply configurations
            modelBuilder.ApplyConfiguration(new ProjectFileConfiguration());

            // Configure User relationships
            modelBuilder.Entity<User>()
                .HasMany(u => u.ProjectEmployee)
                .WithOne(p => p.Employee)
                .HasForeignKey(p => p.CreatedByEmployee)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<User>()
                .HasMany(u => u.ProjectClient)
                .WithOne(p => p.Client)
                .HasForeignKey(p => p.ClientId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<User>()
                .HasMany(u => u.Comments)
                .WithOne(c => c.Employee)
                .HasForeignKey(c => c.CreatedByEmployee)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure Project relationships
            modelBuilder.Entity<Project>()
                .HasMany(p => p.Comments)
                .WithOne(c => c.Project)
                .HasForeignKey(c => c.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Project>()
                .HasMany(p => p.Files)
                .WithOne(f => f.Project)
                .HasForeignKey(f => f.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Project>()
                .HasMany(p => p.Communications)
                .WithOne(c => c.Project)
                .HasForeignKey(c => c.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Project>()
                .HasMany(p => p.ClientInvoices)
                .WithOne(i => i.Project)
                .HasForeignKey(i => i.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Project>()
                .HasOne(p => p.ProjectStatus)
                .WithMany(s => s.Projects)
                .HasForeignKey(p => p.StatusId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure table names to follow PostgreSQL conventions
            modelBuilder.Entity<User>().ToTable("users");
            modelBuilder.Entity<Project>().ToTable("projects");
            modelBuilder.Entity<ProjectStatus>().ToTable("project_statuses");
            modelBuilder.Entity<ProjectComment>().ToTable("project_comments");
            modelBuilder.Entity<ProjectFile>().ToTable("project_files");
            modelBuilder.Entity<ProjectCommunication>().ToTable("project_communications");
            modelBuilder.Entity<ClientInvoice>().ToTable("client_invoices");

            // Set up default values for CreatedTimestamp columns
            modelBuilder.Entity<Project>()
                .Property(p => p.CreatedTimestamp)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            modelBuilder.Entity<ProjectComment>()
                .Property(c => c.CreatedTimestamp)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            modelBuilder.Entity<ProjectFile>()
                .Property(f => f.UploadedTimestamp)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            modelBuilder.Entity<ProjectCommunication>()
                .Property(c => c.CreatedTimestamp)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            modelBuilder.Entity<ClientInvoice>()
                .Property(i => i.CreatedTimestamp)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");
        }
    }
}