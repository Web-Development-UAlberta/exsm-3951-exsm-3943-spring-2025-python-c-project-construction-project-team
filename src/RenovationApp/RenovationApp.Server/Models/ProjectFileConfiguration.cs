using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RenovationApp.Server.Models;

namespace RenovationApp.Server.Data.Configurations
{
    public class ProjectFileConfiguration : IEntityTypeConfiguration<ProjectFile>
    {
        public void Configure(EntityTypeBuilder<ProjectFile> builder)
        {
            // Configure the enum to be stored as a string in the database
            builder
                .Property(e => e.Type)
                .HasConversion<string>()
                .HasColumnType("text");

            // Add a check constraint to ensure only valid values are stored
            builder.ToTable(tb => tb.HasCheckConstraint(
                "CK_ProjectFile_Type",
                "type IN ('PNG', 'JPG', 'JPEG', 'SVG', 'DOC', 'PDF')"
            ));
        }
    }
}