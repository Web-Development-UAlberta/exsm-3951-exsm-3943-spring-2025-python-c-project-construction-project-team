using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace RenovationApp.Server.Migrations
{
    /// <inheritdoc />
    public partial class CreateProjectServicesAndInvoices : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProjectTask_projects_project_id",
                table: "ProjectTask");

            migrationBuilder.DropForeignKey(
                name: "FK_ProjectTask_users_assigned_user_id",
                table: "ProjectTask");

            migrationBuilder.DropForeignKey(
                name: "FK_SupplierServiceTypes_ProjectServiceType_service_type",
                table: "SupplierServiceTypes");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ProjectTask",
                table: "ProjectTask");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ProjectServiceType",
                table: "ProjectServiceType");

            migrationBuilder.RenameTable(
                name: "ProjectTask",
                newName: "ProjectTasks");

            migrationBuilder.RenameTable(
                name: "ProjectServiceType",
                newName: "ProjectServiceTypes");

            migrationBuilder.RenameIndex(
                name: "IX_ProjectTask_project_id",
                table: "ProjectTasks",
                newName: "IX_ProjectTasks_project_id");

            migrationBuilder.RenameIndex(
                name: "IX_ProjectTask_assigned_user_id",
                table: "ProjectTasks",
                newName: "IX_ProjectTasks_assigned_user_id");

            migrationBuilder.AlterColumn<DateTime>(
                name: "created_timestamp",
                table: "ProjectTasks",
                type: "timestamp without time zone",
                nullable: false,
                defaultValueSql: "CURRENT_TIMESTAMP",
                oldClrType: typeof(DateTime),
                oldType: "timestamp without time zone");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ProjectTasks",
                table: "ProjectTasks",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ProjectServiceTypes",
                table: "ProjectServiceTypes",
                column: "name");

            migrationBuilder.CreateTable(
                name: "client_invoices",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    created_timestamp = table.Column<DateTime>(type: "timestamp without time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    description = table.Column<string>(type: "text", nullable: false),
                    payment_instructions = table.Column<string>(type: "text", nullable: false),
                    paid = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    amount = table.Column<decimal>(type: "decimal", nullable: false),
                    project_id = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_client_invoices", x => x.id);
                    table.ForeignKey(
                        name: "FK_client_invoices_projects_project_id",
                        column: x => x.project_id,
                        principalTable: "projects",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProjectServices",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    status = table.Column<int>(type: "int", nullable: false),
                    project_id = table.Column<int>(type: "int", nullable: true),
                    name = table.Column<string>(type: "varchar(255)", nullable: false),
                    description = table.Column<string>(type: "text", nullable: false),
                    service_type = table.Column<string>(type: "varchar(100)", nullable: false),
                    supplier_id = table.Column<int>(type: "int", nullable: true),
                    price_quote = table.Column<decimal>(type: "numeric(10,2)", nullable: false),
                    cost_quote = table.Column<decimal>(type: "numeric(10,2)", nullable: false),
                    start_date_quote = table.Column<DateTime>(type: "timestamp without time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    end_date_quote = table.Column<DateTime>(type: "timestamp without time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    start_date_actual = table.Column<DateTime>(type: "timestamp without time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    end_date_actual = table.Column<DateTime>(type: "timestamp without time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectServices", x => x.id);
                    table.ForeignKey(
                        name: "FK_ProjectServices_ProjectServiceTypes_service_type",
                        column: x => x.service_type,
                        principalTable: "ProjectServiceTypes",
                        principalColumn: "name",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProjectServices_Suppliers_supplier_id",
                        column: x => x.supplier_id,
                        principalTable: "Suppliers",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_ProjectServices_projects_project_id",
                        column: x => x.project_id,
                        principalTable: "projects",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "ProjectServiceInvoices",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    created_timestamp = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    service_id = table.Column<int>(type: "int", nullable: false),
                    amount = table.Column<decimal>(type: "numeric(10,2)", nullable: false),
                    paid_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectServiceInvoices", x => x.id);
                    table.ForeignKey(
                        name: "FK_ProjectServiceInvoices_ProjectServices_service_id",
                        column: x => x.service_id,
                        principalTable: "ProjectServices",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_client_invoices_project_id",
                table: "client_invoices",
                column: "project_id");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectServiceInvoices_service_id",
                table: "ProjectServiceInvoices",
                column: "service_id");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectServices_project_id",
                table: "ProjectServices",
                column: "project_id");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectServices_service_type",
                table: "ProjectServices",
                column: "service_type",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProjectServices_supplier_id",
                table: "ProjectServices",
                column: "supplier_id");

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectTasks_projects_project_id",
                table: "ProjectTasks",
                column: "project_id",
                principalTable: "projects",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectTasks_users_assigned_user_id",
                table: "ProjectTasks",
                column: "assigned_user_id",
                principalTable: "users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SupplierServiceTypes_ProjectServiceTypes_service_type",
                table: "SupplierServiceTypes",
                column: "service_type",
                principalTable: "ProjectServiceTypes",
                principalColumn: "name",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProjectTasks_projects_project_id",
                table: "ProjectTasks");

            migrationBuilder.DropForeignKey(
                name: "FK_ProjectTasks_users_assigned_user_id",
                table: "ProjectTasks");

            migrationBuilder.DropForeignKey(
                name: "FK_SupplierServiceTypes_ProjectServiceTypes_service_type",
                table: "SupplierServiceTypes");

            migrationBuilder.DropTable(
                name: "client_invoices");

            migrationBuilder.DropTable(
                name: "ProjectServiceInvoices");

            migrationBuilder.DropTable(
                name: "ProjectServices");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ProjectTasks",
                table: "ProjectTasks");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ProjectServiceTypes",
                table: "ProjectServiceTypes");

            migrationBuilder.RenameTable(
                name: "ProjectTasks",
                newName: "ProjectTask");

            migrationBuilder.RenameTable(
                name: "ProjectServiceTypes",
                newName: "ProjectServiceType");

            migrationBuilder.RenameIndex(
                name: "IX_ProjectTasks_project_id",
                table: "ProjectTask",
                newName: "IX_ProjectTask_project_id");

            migrationBuilder.RenameIndex(
                name: "IX_ProjectTasks_assigned_user_id",
                table: "ProjectTask",
                newName: "IX_ProjectTask_assigned_user_id");

            migrationBuilder.AlterColumn<DateTime>(
                name: "created_timestamp",
                table: "ProjectTask",
                type: "timestamp without time zone",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "timestamp without time zone",
                oldDefaultValueSql: "CURRENT_TIMESTAMP");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ProjectTask",
                table: "ProjectTask",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ProjectServiceType",
                table: "ProjectServiceType",
                column: "name");

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectTask_projects_project_id",
                table: "ProjectTask",
                column: "project_id",
                principalTable: "projects",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectTask_users_assigned_user_id",
                table: "ProjectTask",
                column: "assigned_user_id",
                principalTable: "users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SupplierServiceTypes_ProjectServiceType_service_type",
                table: "SupplierServiceTypes",
                column: "service_type",
                principalTable: "ProjectServiceType",
                principalColumn: "name",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
