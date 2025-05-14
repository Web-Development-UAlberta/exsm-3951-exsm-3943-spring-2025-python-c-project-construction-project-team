using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RenovationApp.Server.Migrations
{
    /// <inheritdoc />
    public partial class projectRenoType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "renovation_type",
                table: "Projects",
                type: "integer",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "renovation_type",
                table: "Projects");
        }
    }
}
