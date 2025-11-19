using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Data.Migrations
{
    /// <inheritdoc />
    public partial class updated : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MemberLike_Members_SourceMemberId",
                table: "MemberLike");

            migrationBuilder.DropForeignKey(
                name: "FK_MemberLike_Members_TargetMemberId",
                table: "MemberLike");

            migrationBuilder.DropPrimaryKey(
                name: "PK_MemberLike",
                table: "MemberLike");

            migrationBuilder.RenameTable(
                name: "MemberLike",
                newName: "Likes");

            migrationBuilder.RenameIndex(
                name: "IX_MemberLike_TargetMemberId",
                table: "Likes",
                newName: "IX_Likes_TargetMemberId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Likes",
                table: "Likes",
                columns: new[] { "SourceMemberId", "TargetMemberId" });

            migrationBuilder.AddForeignKey(
                name: "FK_Likes_Members_SourceMemberId",
                table: "Likes",
                column: "SourceMemberId",
                principalTable: "Members",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Likes_Members_TargetMemberId",
                table: "Likes",
                column: "TargetMemberId",
                principalTable: "Members",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Likes_Members_SourceMemberId",
                table: "Likes");

            migrationBuilder.DropForeignKey(
                name: "FK_Likes_Members_TargetMemberId",
                table: "Likes");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Likes",
                table: "Likes");

            migrationBuilder.RenameTable(
                name: "Likes",
                newName: "MemberLike");

            migrationBuilder.RenameIndex(
                name: "IX_Likes_TargetMemberId",
                table: "MemberLike",
                newName: "IX_MemberLike_TargetMemberId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_MemberLike",
                table: "MemberLike",
                columns: new[] { "SourceMemberId", "TargetMemberId" });

            migrationBuilder.AddForeignKey(
                name: "FK_MemberLike_Members_SourceMemberId",
                table: "MemberLike",
                column: "SourceMemberId",
                principalTable: "Members",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_MemberLike_Members_TargetMemberId",
                table: "MemberLike",
                column: "TargetMemberId",
                principalTable: "Members",
                principalColumn: "Id");
        }
    }
}
