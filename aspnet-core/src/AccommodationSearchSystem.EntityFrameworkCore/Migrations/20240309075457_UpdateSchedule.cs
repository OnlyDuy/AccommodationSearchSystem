using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AccommodationSearchSystem.Migrations
{
    public partial class UpdateSchedule : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppointmentSchedule");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AppointmentSchedule",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PostsId = table.Column<long>(type: "bigint", nullable: true),
                    UsersId = table.Column<long>(type: "bigint", nullable: true),
                    Confirm = table.Column<bool>(type: "bit", nullable: false),
                    CreationTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatorUserId = table.Column<long>(type: "bigint", nullable: true),
                    Day = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DeleterUserId = table.Column<long>(type: "bigint", nullable: true),
                    DeletionTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                    HostId = table.Column<int>(type: "int", nullable: false),
                    HostName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    HostPhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Hour = table.Column<TimeSpan>(type: "time", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    LastModificationTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastModifierUserId = table.Column<long>(type: "bigint", nullable: true),
                    PostId = table.Column<int>(type: "int", nullable: false),
                    RenterHostName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RenterHostPhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TenantId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppointmentSchedule", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppointmentSchedule_AbpUsers_UsersId",
                        column: x => x.UsersId,
                        principalTable: "AbpUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_AppointmentSchedule_Post_PostsId",
                        column: x => x.PostsId,
                        principalTable: "Post",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppointmentSchedule_PostsId",
                table: "AppointmentSchedule",
                column: "PostsId");

            migrationBuilder.CreateIndex(
                name: "IX_AppointmentSchedule_UsersId",
                table: "AppointmentSchedule",
                column: "UsersId");
        }
    }
}
