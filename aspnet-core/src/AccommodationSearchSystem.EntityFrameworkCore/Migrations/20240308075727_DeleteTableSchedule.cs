using Microsoft.EntityFrameworkCore.Migrations;
using System;

#nullable disable

namespace AccommodationSearchSystem.Migrations
{
    public partial class DeleteTableSchedule : Migration
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
                    PostId = table.Column<long>(type: "bigint", nullable: true),
                    UsersId = table.Column<long>(type: "bigint", nullable: true),
                    HostId = table.Column<int>(type: "int", nullable: false),
                    HostName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    HostPhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RenterHostName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RenterHostPhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Day = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Hour = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Confirm = table.Column<bool>(type: "bit", nullable: false),
                    CreationTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatorUserId = table.Column<long>(type: "bigint", nullable: true),
                    LastModificationTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastModifierUserId = table.Column<long>(type: "bigint", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    DeleterUserId = table.Column<long>(type: "bigint", nullable: true),
                    DeletionTime = table.Column<DateTime>(type: "datetime2", nullable: true)
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
                        name: "FK_AppointmentSchedule_Post_PostId",
                        column: x => x.PostId,
                        principalTable: "Post",
                        principalColumn: "Id");
                });
        }
    }
}
