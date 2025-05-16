using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RenovationApp.Server.Migrations
{
    /// <inheritdoc />
    public partial class RenovationTag : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "RenovationTags",
                columns: table => new
                {
                    id = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RenovationTags", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "ProjectRenovationTags",
                columns: table => new
                {
                    ProjectId = table.Column<int>(type: "int", nullable: false),
                    RenovationTagsId = table.Column<string>(type: "varchar(255)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectRenovationTags", x => new { x.ProjectId, x.RenovationTagsId });
                    table.ForeignKey(
                        name: "FK_ProjectRenovationTags_Projects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "Projects",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProjectRenovationTags_RenovationTags_RenovationTagsId",
                        column: x => x.RenovationTagsId,
                        principalTable: "RenovationTags",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "RenovationTags",
                column: "id",
                values: new object[]
                {
                    "Modern",
                    "Rustic",
                    "Sophisticated"
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProjectRenovationTags_RenovationTagsId",
                table: "ProjectRenovationTags",
                column: "RenovationTagsId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProjectRenovationTags");

            migrationBuilder.DropTable(
                name: "RenovationTags");

        }
    }
}
