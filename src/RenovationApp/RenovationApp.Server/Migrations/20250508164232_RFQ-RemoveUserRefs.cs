using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RenovationApp.Server.Migrations
{
    /// <inheritdoc />
    public partial class RFQRemoveUserRefs : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RFQs_Users_assigned_employee_id",
                table: "RFQs");

            migrationBuilder.DropForeignKey(
                name: "FK_RFQs_Users_client_id",
                table: "RFQs");

            migrationBuilder.DropIndex(
                name: "IX_RFQs_assigned_employee_id",
                table: "RFQs");

            migrationBuilder.DropIndex(
                name: "IX_RFQs_client_id",
                table: "RFQs");

            migrationBuilder.AlterColumn<DateTime>(
                name: "created_timestamp",
                table: "RFQs",
                type: "timestamp with time zone",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "timestamp without time zone");

            migrationBuilder.AlterColumn<string>(
                name: "client_id",
                table: "RFQs",
                type: "varchar(255)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<string>(
                name: "assigned_employee_id",
                table: "RFQs",
                type: "varchar(255)",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "created_timestamp",
                table: "RFQs",
                type: "timestamp without time zone",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone");

            migrationBuilder.AlterColumn<int>(
                name: "client_id",
                table: "RFQs",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(255)");

            migrationBuilder.AlterColumn<int>(
                name: "assigned_employee_id",
                table: "RFQs",
                type: "int",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(255)",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_RFQs_assigned_employee_id",
                table: "RFQs",
                column: "assigned_employee_id");

            migrationBuilder.CreateIndex(
                name: "IX_RFQs_client_id",
                table: "RFQs",
                column: "client_id");

            migrationBuilder.AddForeignKey(
                name: "FK_RFQs_Users_assigned_employee_id",
                table: "RFQs",
                column: "assigned_employee_id",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_RFQs_Users_client_id",
                table: "RFQs",
                column: "client_id",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
