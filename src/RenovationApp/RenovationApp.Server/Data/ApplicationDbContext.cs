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

                // configure the conversion for storing enum arrays in your database
                entity.Property(p => p.RenovationTags)
                    .HasConversion(
                        v => string.Join(',', v),
                        v => v.Split(',', StringSplitOptions.RemoveEmptyEntries)
                            .Select(tag => Enum.Parse<RenovationTag>(tag))
                            .ToArray(),
                        new ValueComparer<RenovationTag[]>(
                            (c1, c2) => c1.SequenceEqual(c2),
                            c => c.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())),
                            c => c.ToArray()
                        )
                    );
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
                .Property(p => p.CreatedTimestamp)
                .HasDefaultValueSql("NOW()"); // PostgreSQL function for current timestamp

            modelBuilder.Entity<ProjectService>()
                .Property(ps => ps.Status)
                .HasConversion<string>();

            modelBuilder.Entity<ProjectFile>()
                .Property(pf => pf.Type)
                .HasConversion<string>();


            modelBuilder.Entity<Project>().HasData(
                new Project
                {
                    Id = 1,
                    CreatedByEmployee = "employee-001",
                    ClientId = "client-001",
                    IsPublic = true,
                    RenovationType = RenovationType.KitchenRemodels,
                    QuotePriceOverride = 12500m,
                    RenovationTags = new[] { RenovationTag.modern, RenovationTag.luxury }
                },
                new Project
                {
                    Id = 2,
                    CreatedByEmployee = "employee-002",
                    ClientId = "client-002",
                    IsPublic = true,
                    RenovationType = RenovationType.BathroomRenovations,
                    QuotePriceOverride = 9500m,
                    RenovationTags = new[] { RenovationTag.rustic }
                },
                new Project
                {
                    Id = 3,
                    CreatedByEmployee = "employee-003",
                    ClientId = "client-003",
                    IsPublic = true,
                    RenovationType = RenovationType.BasementFinishing,
                    QuotePriceOverride = 18000m,
                    RenovationTags = new[] { RenovationTag.modern, RenovationTag.luxury }
                },
                new Project
                {
                    Id = 4,
                    CreatedByEmployee = "employee-004",
                    ClientId = "client-004",
                    IsPublic = true,
                    RenovationType = RenovationType.BathroomRenovations,
                    RenovationTags = new[] { RenovationTag.rustic }
                },
                new Project
                {
                    Id = 5,
                    CreatedByEmployee = "employee-001",
                    ClientId = "client-005",
                    IsPublic = true,
                    RenovationType = RenovationType.KitchenRemodels,
                    QuotePriceOverride = 7600m,
                    RenovationTags = new[] { RenovationTag.countrstyle }
                },
                new Project
                {
                    Id = 6,
                    CreatedByEmployee = "employee-002",
                    ClientId = "client-006",
                    IsPublic = true,
                    RenovationType = RenovationType.HomeAdditions,
                    RenovationTags = new[] { RenovationTag.rustic, RenovationTag.modern }
                },
                new Project
                {
                    Id = 7,
                    CreatedByEmployee = "employee-001",
                    ClientId = "client-007",
                    IsPublic = true,
                    RenovationType = RenovationType.HomeAdditions,
                    QuotePriceOverride = 12300m,
                    RenovationTags = new[] { RenovationTag.rustic, RenovationTag.modern }
                },
                new Project
                {
                    Id = 8,
                    CreatedByEmployee = "employee-004",
                    ClientId = "client-008",
                    IsPublic = true,
                    RenovationType = RenovationType.KitchenRemodels,
                    RenovationTags = new[] { RenovationTag.countrstyle, RenovationTag.luxury }
                },
                new Project
                {
                    Id = 9,
                    CreatedByEmployee = "employee-001",
                    ClientId = "client-009",
                    IsPublic = true,
                    RenovationType = RenovationType.BasementFinishing,
                    RenovationTags = new[] { RenovationTag.luxury, RenovationTag.modern }
                }
            );

            modelBuilder.Entity<ClientInvoice>().HasData(
                new ClientInvoice { Id = 1, ProjectId = 1, Amount = 5500 },
                new ClientInvoice { Id = 2, ProjectId = 1, Amount = 3000 },
                new ClientInvoice { Id = 3, ProjectId = 2, Amount = 6000 },
                new ClientInvoice { Id = 4, ProjectId = 3, Amount = 9000 },
                new ClientInvoice { Id = 5, ProjectId = 4, Amount = 8000 },
                new ClientInvoice { Id = 6, ProjectId = 5, Amount = 8000 },
                new ClientInvoice { Id = 7, ProjectId = 6, Amount = 8000 },
                new ClientInvoice { Id = 8, ProjectId = 7, Amount = 4000 },
                new ClientInvoice { Id = 9, ProjectId = 8, Amount = 5000 },
                new ClientInvoice { Id = 10, ProjectId = 9, Amount = 3500 }
            );
        }
    }
}