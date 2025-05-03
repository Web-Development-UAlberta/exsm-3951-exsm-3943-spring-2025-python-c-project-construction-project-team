using RenovationApp.Server.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;

namespace RenovationApp.Server.Data
{
    public class ToAddToDbContext : IdentityDbContext
    {
        public ToAddToDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<ProjectService> ProjectServices { get; set; } = null!;
        public DbSet<ProjectServiceType> ProjectServiceTypes { get; set; } = null!;
        public DbSet<Supplier> Suppliers { get; set; } = null!;
        public DbSet<SupplierServiceType> SupplierServiceTypes { get; set; } = null!;
        public DbSet<ProjectServiceInvoice> ProjectServiceInvoices { get; set; } = null!;
        public DbSet<ProjectTask> ProjectTasks { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

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
        }
    }
}
