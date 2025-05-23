using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
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


            // Seed sample data for ProjectFiles
            modelBuilder.Entity<ProjectFile>().HasData(
                new ProjectFile
                {
                    Id = 1,
                    UploadedTimestamp = DateTime.SpecifyKind(new DateTime(2025, 5, 23, 19, 7, 6, 196).AddTicks(7680), DateTimeKind.Utc),
                    FileUri = "1/image/aa050bf6-11ea-4159-a7a0-c7fb988153fd_kitchen-modern-1-2.jpg",
                    FileName = "kitchen-modern-1-2.jpg",
                    Type = FileType.image,
                    ProjectId = 1
                },
                new ProjectFile
                {
                    Id = 2,
                    UploadedTimestamp = DateTime.SpecifyKind(new DateTime(2025, 5, 23, 19, 7, 6, 327).AddTicks(1310), DateTimeKind.Utc),
                    FileUri = "1/image/de55d569-d39d-4eae-a213-d2c38944bcc3_kitchen-modern-1-3.jpg",
                    FileName = "kitchen-modern-1-3.jpg",
                    Type = FileType.image,
                    ProjectId = 1
                },
                new ProjectFile
                {
                    Id = 3,
                    UploadedTimestamp = DateTime.SpecifyKind(new DateTime(2025, 5, 23, 19, 7, 6, 394).AddTicks(8360), DateTimeKind.Utc),
                    FileUri = "1/image/dfc7aac0-cba0-4ab3-90a5-76535629cd09_kitchen-modern-1-1.jpg",
                    FileName = "kitchen-modern-1-1.jpg",
                    Type = FileType.image,
                    ProjectId = 1
                },
                new ProjectFile
                {
                    Id = 4,
                    UploadedTimestamp = DateTime.SpecifyKind(new DateTime(2025, 5, 23, 19, 7, 37, 32).AddTicks(8650), DateTimeKind.Utc),
                    FileUri = "2/image/14031773-ce2c-4084-81ad-083e48787a06_bathroom-2-1.jpg",
                    FileName = "bathroom-2-1.jpg",
                    Type = FileType.image,
                    ProjectId = 2
                },
                new ProjectFile
                {
                    Id = 5,
                    UploadedTimestamp = DateTime.SpecifyKind(new DateTime(2025, 5, 23, 19, 7, 37, 132).AddTicks(1750), DateTimeKind.Utc),
                    FileUri = "2/image/81b25b05-7a18-46a3-bfca-a3223a3f2154_bathroom-2-2.jpg",
                    FileName = "bathroom-2-2.jpg",
                    Type = FileType.image,
                    ProjectId = 2
                },
                new ProjectFile
                {
                    Id = 6,
                    UploadedTimestamp = DateTime.SpecifyKind(new DateTime(2025, 5, 23, 19, 7, 37, 277).AddTicks(3010), DateTimeKind.Utc),
                    FileUri = "2/image/309fb788-836a-4a36-8f47-805096eb663e_bathroom-2-3.jpg",
                    FileName = "bathroom-2-3.jpg",
                    Type = FileType.image,
                    ProjectId = 2
                },
                new ProjectFile
                {
                    Id = 7,
                    UploadedTimestamp = DateTime.SpecifyKind(new DateTime(2025, 5, 23, 19, 8, 5, 117).AddTicks(4110), DateTimeKind.Utc),
                    FileUri = "3/image/5ad494f2-edc1-4662-a342-4ffb3f880b66_basement-rustic-3.jpg",
                    FileName = "basement-rustic-3.jpg",
                    Type = FileType.image,
                    ProjectId = 3
                },
                new ProjectFile
                {
                    Id = 8,
                    UploadedTimestamp = DateTime.SpecifyKind(new DateTime(2025, 5, 23, 19, 8, 18, 138).AddTicks(5180), DateTimeKind.Utc),
                    FileUri = "4/image/9313909c-00e2-4b84-aa88-973d3ee59720_home-additions-4.jpg",
                    FileName = "home-additions-4.jpg",
                    Type = FileType.image,
                    ProjectId = 4
                },
                new ProjectFile
                {
                    Id = 9,
                    UploadedTimestamp = DateTime.SpecifyKind(new DateTime(2025, 5, 23, 19, 8, 40, 418).AddTicks(8500), DateTimeKind.Utc),
                    FileUri = "5/image/f2c9ef54-fad9-4782-9ce2-13d44393a1d7_kitchen-rustic-5.jpg",
                    FileName = "kitchen-rustic-5.jpg",
                    Type = FileType.image,
                    ProjectId = 5
                },
                new ProjectFile
                {
                    Id = 10,
                    UploadedTimestamp = DateTime.SpecifyKind(new DateTime(2025, 5, 23, 19, 9, 8, 519).AddTicks(7940), DateTimeKind.Utc),
                    FileUri = "6/image/41ffa27f-06ec-412b-a9d3-336ab2b29744_bathroom-6.jpg",
                    FileName = "bathroom-6.jpg",
                    Type = FileType.image,
                    ProjectId = 6
                },
                new ProjectFile
                {
                    Id = 11,
                    UploadedTimestamp = DateTime.SpecifyKind(new DateTime(2025, 5, 23, 19, 9, 32, 121).AddTicks(3790), DateTimeKind.Utc),
                    FileUri = "7/image/cafd4a1b-0614-4606-9af3-81d8e9927dfb_basements-shpisticated-7.jpg",
                    FileName = "basements-shpisticated-7.jpg",
                    Type = FileType.image,
                    ProjectId = 7
                },
                new ProjectFile
                {
                    Id = 12,
                    UploadedTimestamp = DateTime.SpecifyKind(new DateTime(2025, 5, 23, 19, 9, 52, 246).AddTicks(4560), DateTimeKind.Utc),
                    FileUri = "8/image/6d7e9224-7054-419d-b6c2-f96d6db032c9_home-additions-8.jpg",
                    FileName = "home-additions-8.jpg",
                    Type = FileType.image,
                    ProjectId = 8
                }
            );
        }
    }
}