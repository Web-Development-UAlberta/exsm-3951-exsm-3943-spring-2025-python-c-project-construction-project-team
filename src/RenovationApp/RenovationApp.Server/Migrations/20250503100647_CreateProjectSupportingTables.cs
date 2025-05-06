using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace RenovationApp.Server.Migrations
{
    /// <inheritdoc />
    public partial class CreateProjectSupportingTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUserClaims_AspNetUsers_UserId",
                table: "AspNetUserClaims");

            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUserLogins_AspNetUsers_UserId",
                table: "AspNetUserLogins");

            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUserRoles_AspNetUsers_UserId",
                table: "AspNetUserRoles");

            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_UserRoles_role",
                table: "AspNetUsers");

            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUserTokens_AspNetUsers_UserId",
                table: "AspNetUserTokens");

            migrationBuilder.DropForeignKey(
                name: "FK_Projects_ProjectStatuses_status_id",
                table: "Projects");

            migrationBuilder.DropForeignKey(
                name: "FK_RFQs_AspNetUsers_AssignedEmployeeId",
                table: "RFQs");

            migrationBuilder.DropForeignKey(
                name: "FK_RFQs_AspNetUsers_ClientId",
                table: "RFQs");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Projects",
                table: "Projects");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ProjectStatuses",
                table: "ProjectStatuses");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AspNetUsers",
                table: "AspNetUsers");

            migrationBuilder.RenameTable(
                name: "Projects",
                newName: "projects");

            migrationBuilder.RenameTable(
                name: "ProjectStatuses",
                newName: "project_statuses");

            migrationBuilder.RenameTable(
                name: "AspNetUsers",
                newName: "users");

            migrationBuilder.RenameIndex(
                name: "IX_Projects_status_id",
                table: "projects",
                newName: "IX_projects_status_id");

            migrationBuilder.RenameIndex(
                name: "IX_AspNetUsers_role",
                table: "users",
                newName: "IX_users_role");

            migrationBuilder.AlterColumn<DateTime>(
                name: "created_timestamp",
                table: "projects",
                type: "timestamp without time zone",
                nullable: false,
                defaultValueSql: "CURRENT_TIMESTAMP",
                oldClrType: typeof(DateTime),
                oldType: "timestamp without time zone");

            migrationBuilder.AddColumn<int>(
                name: "client_id",
                table: "projects",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "created_by_employee",
                table: "projects",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_projects",
                table: "projects",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_project_statuses",
                table: "project_statuses",
                column: "Status");

            migrationBuilder.AddPrimaryKey(
                name: "PK_users",
                table: "users",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "project_comments",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    comment = table.Column<string>(type: "text", nullable: false),
                    created_timestamp = table.Column<DateTime>(type: "timestamp without time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    created_by_employee = table.Column<int>(type: "integer", nullable: false),
                    project_id = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_project_comments", x => x.id);
                    table.ForeignKey(
                        name: "FK_project_comments_projects_project_id",
                        column: x => x.project_id,
                        principalTable: "projects",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_project_comments_users_created_by_employee",
                        column: x => x.created_by_employee,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "project_communications",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    created_timestamp = table.Column<DateTime>(type: "timestamp without time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    communication_timestamp = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    communication_method = table.Column<string>(type: "text", nullable: false),
                    project_id = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_project_communications", x => x.id);
                    table.ForeignKey(
                        name: "FK_project_communications_projects_project_id",
                        column: x => x.project_id,
                        principalTable: "projects",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "project_files",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    uploaded_timestamp = table.Column<DateTime>(type: "timestamp without time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    file_uri = table.Column<string>(type: "text", nullable: false),
                    file_name = table.Column<string>(type: "text", nullable: false),
                    type = table.Column<string>(type: "text", nullable: false),
                    project_id = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_project_files", x => x.id);
                    table.CheckConstraint("CK_ProjectFile_Type", "type IN ('PNG', 'JPG', 'JPEG', 'SVG', 'DOC', 'PDF')");
                    table.ForeignKey(
                        name: "FK_project_files_projects_project_id",
                        column: x => x.project_id,
                        principalTable: "projects",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProjectTask",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    created_timestamp = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    project_id = table.Column<int>(type: "int", nullable: true),
                    assigned_user_id = table.Column<int>(type: "int", nullable: false),
                    title = table.Column<string>(type: "text", maxLength: 100, nullable: false),
                    description = table.Column<string>(type: "text", nullable: false),
                    status = table.Column<string>(type: "text", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectTask", x => x.id);
                    table.ForeignKey(
                        name: "FK_ProjectTask_projects_project_id",
                        column: x => x.project_id,
                        principalTable: "projects",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProjectTask_users_assigned_user_id",
                        column: x => x.assigned_user_id,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_projects_client_id",
                table: "projects",
                column: "client_id");

            migrationBuilder.CreateIndex(
                name: "IX_projects_created_by_employee",
                table: "projects",
                column: "created_by_employee");

            migrationBuilder.CreateIndex(
                name: "IX_project_comments_created_by_employee",
                table: "project_comments",
                column: "created_by_employee");

            migrationBuilder.CreateIndex(
                name: "IX_project_comments_project_id",
                table: "project_comments",
                column: "project_id");

            migrationBuilder.CreateIndex(
                name: "IX_project_communications_project_id",
                table: "project_communications",
                column: "project_id");

            migrationBuilder.CreateIndex(
                name: "IX_project_files_project_id",
                table: "project_files",
                column: "project_id");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectTask_assigned_user_id",
                table: "ProjectTask",
                column: "assigned_user_id");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectTask_project_id",
                table: "ProjectTask",
                column: "project_id");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUserClaims_users_UserId",
                table: "AspNetUserClaims",
                column: "UserId",
                principalTable: "users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUserLogins_users_UserId",
                table: "AspNetUserLogins",
                column: "UserId",
                principalTable: "users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUserRoles_users_UserId",
                table: "AspNetUserRoles",
                column: "UserId",
                principalTable: "users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUserTokens_users_UserId",
                table: "AspNetUserTokens",
                column: "UserId",
                principalTable: "users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_projects_project_statuses_status_id",
                table: "projects",
                column: "status_id",
                principalTable: "project_statuses",
                principalColumn: "Status",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_projects_users_client_id",
                table: "projects",
                column: "client_id",
                principalTable: "users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_projects_users_created_by_employee",
                table: "projects",
                column: "created_by_employee",
                principalTable: "users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_RFQs_users_AssignedEmployeeId",
                table: "RFQs",
                column: "AssignedEmployeeId",
                principalTable: "users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_RFQs_users_ClientId",
                table: "RFQs",
                column: "ClientId",
                principalTable: "users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_users_UserRoles_role",
                table: "users",
                column: "role",
                principalTable: "UserRoles",
                principalColumn: "Name",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUserClaims_users_UserId",
                table: "AspNetUserClaims");

            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUserLogins_users_UserId",
                table: "AspNetUserLogins");

            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUserRoles_users_UserId",
                table: "AspNetUserRoles");

            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUserTokens_users_UserId",
                table: "AspNetUserTokens");

            migrationBuilder.DropForeignKey(
                name: "FK_projects_project_statuses_status_id",
                table: "projects");

            migrationBuilder.DropForeignKey(
                name: "FK_projects_users_client_id",
                table: "projects");

            migrationBuilder.DropForeignKey(
                name: "FK_projects_users_created_by_employee",
                table: "projects");

            migrationBuilder.DropForeignKey(
                name: "FK_RFQs_users_AssignedEmployeeId",
                table: "RFQs");

            migrationBuilder.DropForeignKey(
                name: "FK_RFQs_users_ClientId",
                table: "RFQs");

            migrationBuilder.DropForeignKey(
                name: "FK_users_UserRoles_role",
                table: "users");

            migrationBuilder.DropTable(
                name: "project_comments");

            migrationBuilder.DropTable(
                name: "project_communications");

            migrationBuilder.DropTable(
                name: "project_files");

            migrationBuilder.DropTable(
                name: "ProjectTask");

            migrationBuilder.DropPrimaryKey(
                name: "PK_projects",
                table: "projects");

            migrationBuilder.DropIndex(
                name: "IX_projects_client_id",
                table: "projects");

            migrationBuilder.DropIndex(
                name: "IX_projects_created_by_employee",
                table: "projects");

            migrationBuilder.DropPrimaryKey(
                name: "PK_users",
                table: "users");

            migrationBuilder.DropPrimaryKey(
                name: "PK_project_statuses",
                table: "project_statuses");

            migrationBuilder.DropColumn(
                name: "client_id",
                table: "projects");

            migrationBuilder.DropColumn(
                name: "created_by_employee",
                table: "projects");

            migrationBuilder.RenameTable(
                name: "projects",
                newName: "Projects");

            migrationBuilder.RenameTable(
                name: "users",
                newName: "AspNetUsers");

            migrationBuilder.RenameTable(
                name: "project_statuses",
                newName: "ProjectStatuses");

            migrationBuilder.RenameIndex(
                name: "IX_projects_status_id",
                table: "Projects",
                newName: "IX_Projects_status_id");

            migrationBuilder.RenameIndex(
                name: "IX_users_role",
                table: "AspNetUsers",
                newName: "IX_AspNetUsers_role");

            migrationBuilder.AlterColumn<DateTime>(
                name: "created_timestamp",
                table: "Projects",
                type: "timestamp without time zone",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "timestamp without time zone",
                oldDefaultValueSql: "CURRENT_TIMESTAMP");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Projects",
                table: "Projects",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AspNetUsers",
                table: "AspNetUsers",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ProjectStatuses",
                table: "ProjectStatuses",
                column: "Status");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUserClaims_AspNetUsers_UserId",
                table: "AspNetUserClaims",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUserLogins_AspNetUsers_UserId",
                table: "AspNetUserLogins",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUserRoles_AspNetUsers_UserId",
                table: "AspNetUserRoles",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_UserRoles_role",
                table: "AspNetUsers",
                column: "role",
                principalTable: "UserRoles",
                principalColumn: "Name",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUserTokens_AspNetUsers_UserId",
                table: "AspNetUserTokens",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Projects_ProjectStatuses_status_id",
                table: "Projects",
                column: "status_id",
                principalTable: "ProjectStatuses",
                principalColumn: "Status",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_RFQs_AspNetUsers_AssignedEmployeeId",
                table: "RFQs",
                column: "AssignedEmployeeId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_RFQs_AspNetUsers_ClientId",
                table: "RFQs",
                column: "ClientId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
