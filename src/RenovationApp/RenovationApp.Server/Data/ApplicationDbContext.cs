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

        public DbSet<Project> Projects { get; set; }
        public DbSet<ProjectComment> ProjectComments { get; set; }
        public DbSet<ProjectCommunication> ProjectCommunications { get; set; }
        public DbSet<ProjectFile> ProjectFiles { get; set; }
        public DbSet<ProjectService> ProjectServices { get; set; }
        public DbSet<ProjectServiceInvoice> ProjectServiceInvoices { get; set; }
        public DbSet<ProjectServiceType> ProjectServiceTypes { get; set; }
        public DbSet<ProjectTask> ProjectTasks { get; set; }
        public DbSet<RFQ> RFQs { get; set; }
        public DbSet<RFQImage> RFQImages { get; set; }
        public DbSet<ClientInvoice> ClientInvoices { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure User entity
            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("Users");
                
                // Configure relationships with Project model
                entity.HasMany(u => u.ProjectEmployee)
                    .WithOne(p => p.Employee)
                    .HasForeignKey(p => p.CreatedByEmployee)
                    .OnDelete(DeleteBehavior.SetNull);

                entity.HasMany(u => u.ProjectClient)
                    .WithOne(p => p.Client)
                    .HasForeignKey(p => p.ClientId)
                    .OnDelete(DeleteBehavior.Cascade);

                // Configure relationships with ProjectComment
                entity.HasMany(u => u.Comments)
                    .WithOne(pc => pc.Employee)
                    .HasForeignKey(pc => pc.CreatedByEmployee)
                    .OnDelete(DeleteBehavior.SetNull);

                // Configure relationships with ProjectTask
                entity.HasMany(u => u.ProjectTasks)
                    .WithOne(pt => pt.AssignedUser)
                    .HasForeignKey(pt => pt.UserId)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            // Configure Project entity
            modelBuilder.Entity<Project>(entity =>
            {
                entity.ToTable("Projects");

                // Configure relationships with RFQ
                entity.HasOne(p => p.RFQ)
                    .WithOne(r => r.Project)
                    .HasForeignKey<Project>(p => p.RFQId)
                    .OnDelete(DeleteBehavior.SetNull);

                // Configure relationship with ProjectComment
                entity.HasMany(p => p.Comments)
                    .WithOne(pc => pc.Project)
                    .HasForeignKey(pc => pc.ProjectId)
                    .OnDelete(DeleteBehavior.Cascade);

                // Configure relationship with ProjectFile
                entity.HasMany(p => p.Files)
                    .WithOne(pf => pf.Project)
                    .HasForeignKey(pf => pf.ProjectId)
                    .OnDelete(DeleteBehavior.Cascade);

                // Configure relationship with ProjectCommunication
                entity.HasMany(p => p.Communications)
                    .WithOne(pc => pc.Project)
                    .HasForeignKey(pc => pc.ProjectId)
                    .OnDelete(DeleteBehavior.Cascade);

                // Configure relationship with ClientInvoice
                entity.HasMany(p => p.ClientInvoices)
                    .WithOne(ci => ci.Project)
                    .HasForeignKey(ci => ci.ProjectId)
                    .OnDelete(DeleteBehavior.SetNull);

                // Configure relationship with ProjectService
                entity.HasMany(p => p.ProjectServices)
                    .WithOne(ps => ps.Project)
                    .HasForeignKey(ps => ps.ProjectId)
                    .OnDelete(DeleteBehavior.Cascade);

                // Configure relationship with ProjectTask
                entity.HasMany(p => p.ProjectTasks)
                    .WithOne(pt => pt.Project)
                    .HasForeignKey(pt => pt.ProjectId)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            // Configure RFQ entity
            modelBuilder.Entity<RFQ>(entity =>
            {
                entity.ToTable("RFQs");

                // Configure relationship with RFQImage
                entity.HasMany(r => r.RFQImages)
                    .WithOne(ri => ri.RFQ)
                    .HasForeignKey(ri => ri.RFQId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Configure RFQImage entity
            modelBuilder.Entity<RFQImage>(entity =>
            {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.FileName)
                  .IsRequired()
                  .HasMaxLength(255);

            entity.Property(e => e.FilePath)
                  .IsRequired()
                  .HasMaxLength(500);

            entity.Property(e => e.ImageUri)
                  .IsRequired();

            entity.HasOne(e => e.RFQ)
                  .WithMany(r => r.RFQImages)
                  .HasForeignKey(e => e.RFQId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

            // Configure ProjectService entity
            modelBuilder.Entity<ProjectService>(entity =>
            {
                entity.ToTable("ProjectServices");

                // Configure relationship with ProjectServiceInvoice
                entity.HasMany(ps => ps.ProjectServiceInvoices)
                    .WithOne(psi => psi.ProjectService)
                    .HasForeignKey(psi => psi.ProjectServiceId)
                    .OnDelete(DeleteBehavior.Cascade);

                // Configure relationship with ProjectServiceType
                entity.HasOne(ps => ps.ProjectServiceType)
                    .WithMany(pst => pst.ProjectServices)
                    .HasForeignKey(ps => ps.ProjectServiceTypeId)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            // Configure enums as strings
            modelBuilder.Entity<RFQ>()
                .Property(r => r.Status)
                .HasConversion<string>();

            modelBuilder.Entity<RFQ>()
                .Property(r => r.RenovationType)
                .HasConversion<string>();

            modelBuilder.Entity<RFQ>()
                .Property(r => r.RoomSize)
                .HasConversion<string>();

            modelBuilder.Entity<User>()
                .Property(u => u.Role)
                .HasConversion<string>();

            modelBuilder.Entity<Project>()
                .Property(p => p.Status)
                .HasConversion<string>();

            modelBuilder.Entity<ProjectService>()
                .Property(ps => ps.Status)
                .HasConversion<string>();

            modelBuilder.Entity<ProjectFile>()
                .Property(pf => pf.Type)
                .HasConversion<string>();
        }
    }
}