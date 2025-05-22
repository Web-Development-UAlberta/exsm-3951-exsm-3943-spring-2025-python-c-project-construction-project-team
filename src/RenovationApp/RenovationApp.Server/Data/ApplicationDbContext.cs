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
        public DbSet<RenovationTag> RenovationTags { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

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

            // Many-to-many: Project <-> RenovationTag
            modelBuilder.Entity<Project>()
                .HasMany(p => p.RenovationTags)
                .WithMany()
                .UsingEntity<ProjectRenovationTag>(
                    j => j
                        .HasOne<RenovationTag>()
                        .WithMany()
                        .HasForeignKey(prt => prt.RenovationTagsId),
                    j => j
                        .HasOne<Project>()
                        .WithMany()
                        .HasForeignKey(prt => prt.ProjectId),
                    j =>
                    {
                        j.ToTable("ProjectRenovationTags");
                        j.HasKey(prt => new { prt.ProjectId, prt.RenovationTagsId });
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

            modelBuilder.Entity<Project>()
                .Property(p => p.RenovationType)
                .HasConversion<string>();

            modelBuilder.Entity<ProjectService>()
                .Property(ps => ps.Status)
                .HasConversion<string>();

            modelBuilder.Entity<ProjectFile>()
                .Property(pf => pf.Type)
                .HasConversion<string>();

            // Seed sample data for RenovationTags
            modelBuilder.Entity<RenovationTag>().HasData(
                new RenovationTag { Id = "Modern" },
                new RenovationTag { Id = "Rustic" },
                new RenovationTag { Id = "Sophisticated" }
            );

            // Seed sample data for Projects
            var seedDate = DateTime.SpecifyKind(new DateTime(2025, 5, 21), DateTimeKind.Utc);

            modelBuilder.Entity<Project>().HasData(
                new Project
                {
                    Id = 1,
                    CreatedTimestamp = seedDate,
                    CreatedByEmployee = "2caf9d13-45db-4960-8a81-a4ffb48dc8f3",
                    ClientId = "2025-05-19T17:37:40.401185Z",
                    IsPublic = true,
                    RenovationType = RenovationType.KitchenRemodels,
                    QuotePriceOverride = 15000.00m
                },
                new Project
                {
                    Id = 2,
                    CreatedTimestamp = seedDate,
                    CreatedByEmployee = "2caf9d13-45db-4960-8a81-a4ffb48dc8f3",
                    ClientId = "2025-05-19T17:37:40.401185Z",
                    IsPublic = true,
                    RenovationType = RenovationType.BathroomRenovations,
                    QuotePriceOverride = 9800.50m
                },
                new Project
                {
                    Id = 3,
                    CreatedTimestamp = seedDate,
                    CreatedByEmployee = "2caf9d13-45db-4960-8a81-a4ffb48dc8f3",
                    ClientId = "2025-05-19T17:37:40.401185Z",
                    IsPublic = true,
                    RenovationType = RenovationType.BasementFinishing,
                    QuotePriceOverride = 20000.00m
                },
                new Project
                {
                    Id = 4,
                    CreatedTimestamp = seedDate,
                    CreatedByEmployee = "2caf9d13-45db-4960-8a81-a4ffb48dc8f3",
                    ClientId = "2025-05-19T17:37:40.401185Z",
                    IsPublic = true,
                    RenovationType = RenovationType.HomeAdditions,
                    QuotePriceOverride = 45000.00m
                },
                new Project
                {
                    Id = 5,
                    CreatedTimestamp = seedDate,
                    CreatedByEmployee = "2caf9d13-45db-4960-8a81-a4ffb48dc8f3",
                    ClientId = "2025-05-19T17:37:40.401185Z",
                    IsPublic = true,
                    RenovationType = RenovationType.KitchenRemodels,
                    QuotePriceOverride = 12300.00m
                },
                new Project
                {
                    Id = 6,
                    CreatedTimestamp = seedDate,
                    CreatedByEmployee = "2caf9d13-45db-4960-8a81-a4ffb48dc8f3",
                    ClientId = "2025-05-19T17:37:40.401185Z",
                    IsPublic = true,
                    RenovationType = RenovationType.BathroomRenovations,
                    QuotePriceOverride = 8700.75m
                },
                new Project
                {
                    Id = 7,
                    CreatedTimestamp = seedDate,
                    CreatedByEmployee = "2caf9d13-45db-4960-8a81-a4ffb48dc8f3",
                    ClientId = "2025-05-19T17:37:40.401185Z",
                    IsPublic = true,
                    RenovationType = RenovationType.BasementFinishing,
                    QuotePriceOverride = 17450.20m
                },
                new Project
                {
                    Id = 8,
                    CreatedTimestamp = seedDate,
                    CreatedByEmployee = "2caf9d13-45db-4960-8a81-a4ffb48dc8f3",
                    ClientId = "2025-05-19T17:37:40.401185Z",
                    IsPublic = true,
                    RenovationType = RenovationType.HomeAdditions,
                    QuotePriceOverride = 39999.99m
                }
            );

            // Seed sample data for the ProjectRenovationTags join table
            modelBuilder.Entity<ProjectRenovationTag>().HasData(
                new ProjectRenovationTag { ProjectId = 1, RenovationTagsId = "Modern" },
                new ProjectRenovationTag { ProjectId = 2, RenovationTagsId = "Modern" },
                new ProjectRenovationTag { ProjectId = 2, RenovationTagsId = "Rustic" },
                new ProjectRenovationTag { ProjectId = 3, RenovationTagsId = "Rustic" },
                new ProjectRenovationTag { ProjectId = 3, RenovationTagsId = "Sophisticated" },
                new ProjectRenovationTag { ProjectId = 4, RenovationTagsId = "Modern" },
                new ProjectRenovationTag { ProjectId = 4, RenovationTagsId = "Sophisticated" },
                new ProjectRenovationTag { ProjectId = 5, RenovationTagsId = "Rustic" },
                new ProjectRenovationTag { ProjectId = 6, RenovationTagsId = "Modern" },
                new ProjectRenovationTag { ProjectId = 6, RenovationTagsId = "Rustic" },
                new ProjectRenovationTag { ProjectId = 6, RenovationTagsId = "Sophisticated" },
                new ProjectRenovationTag { ProjectId = 7, RenovationTagsId = "Sophisticated" },
                new ProjectRenovationTag { ProjectId = 8, RenovationTagsId = "Modern" },
                new ProjectRenovationTag { ProjectId = 8, RenovationTagsId = "Rustic" }
            );
        }
    }
}