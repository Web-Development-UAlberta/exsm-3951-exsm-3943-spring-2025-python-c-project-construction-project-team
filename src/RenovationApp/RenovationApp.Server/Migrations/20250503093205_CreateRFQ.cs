using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace RenovationApp.Server.Migrations
{
    /// <inheritdoc />
    public partial class CreateRFQ : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "RFQs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    CreatedTimestamp = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ClientId = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<string>(type: "character varying(30)", nullable: false),
                    AssignedEmployeeId = table.Column<int>(type: "integer", nullable: false),
                    PreferredMaterial = table.Column<string>(type: "character varying(160)", maxLength: 160, nullable: false),
                    Description = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    RenovationType = table.Column<string>(type: "text", nullable: false),
                    Budget = table.Column<decimal>(type: "numeric(9,2)", nullable: false),
                    ProjectAddress = table.Column<string>(type: "character varying(160)", maxLength: 160, nullable: false),
                    RoomSize = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RFQs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RFQs_AspNetUsers_AssignedEmployeeId",
                        column: x => x.AssignedEmployeeId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_RFQs_AspNetUsers_ClientId",
                        column: x => x.ClientId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_RFQs_RFQStatuses_Status",
                        column: x => x.Status,
                        principalTable: "RFQStatuses",
                        principalColumn: "Status",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RFQs_RenovationTypes_RenovationType",
                        column: x => x.RenovationType,
                        principalTable: "RenovationTypes",
                        principalColumn: "Name",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RFQImages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UploadedTimestamp = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ImageUri = table.Column<string>(type: "text", nullable: false),
                    RFQId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RFQImages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RFQImages_RFQs_RFQId",
                        column: x => x.RFQId,
                        principalTable: "RFQs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_RFQImages_RFQId",
                table: "RFQImages",
                column: "RFQId");

            migrationBuilder.CreateIndex(
                name: "IX_RFQs_AssignedEmployeeId",
                table: "RFQs",
                column: "AssignedEmployeeId");

            migrationBuilder.CreateIndex(
                name: "IX_RFQs_ClientId",
                table: "RFQs",
                column: "ClientId");

            migrationBuilder.CreateIndex(
                name: "IX_RFQs_RenovationType",
                table: "RFQs",
                column: "RenovationType");

            migrationBuilder.CreateIndex(
                name: "IX_RFQs_Status",
                table: "RFQs",
                column: "Status");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RFQImages");

            migrationBuilder.DropTable(
                name: "RFQs");
        }
    }
}
