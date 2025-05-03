using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace RenovationApp.Server.Migrations
{
    /// <inheritdoc />
    public partial class CreateProjectTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "id",
                table: "ProjectStatuses");

            migrationBuilder.RenameColumn(
                name: "status",
                table: "ProjectStatuses",
                newName: "Status");

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "ProjectStatuses",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text",
                oldMaxLength: 50);

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "ProjectStatuses",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "Projects",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    created_timestamp = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    status_id = table.Column<string>(type: "character varying(50)", nullable: false),
                    is_public = table.Column<bool>(type: "boolean", nullable: false),
                    quote_price_override = table.Column<decimal>(type: "numeric", nullable: true),
                    quote_schedule_start_override = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    quote_schedule_end_override = table.Column<DateTime>(type: "timestamp without time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Projects", x => x.id);
                    table.ForeignKey(
                        name: "FK_Projects_ProjectStatuses_status_id",
                        column: x => x.status_id,
                        principalTable: "ProjectStatuses",
                        principalColumn: "Status",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Projects_status_id",
                table: "Projects",
                column: "status_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Projects");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "ProjectStatuses");

            migrationBuilder.RenameColumn(
                name: "Status",
                table: "ProjectStatuses",
                newName: "status");

            migrationBuilder.AlterColumn<string>(
                name: "status",
                table: "ProjectStatuses",
                type: "text",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(50)",
                oldMaxLength: 50);

            migrationBuilder.AddColumn<int>(
                name: "id",
                table: "ProjectStatuses",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }
    }
}
