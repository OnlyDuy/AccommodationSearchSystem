using Abp.Runtime.Session;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AccommodationSearchSystem.Chat.Signalr
{
    public class CommentHub : Hub
    {
        public async Task SendComment(string comment)
        {
            //var commentWithTimestamp = $"{DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ss")}::{comment}";
            await Clients.All.SendAsync("ReceiveComment", comment);
        }
        public async Task UpdateComment(string comment)
        {
            // Gửi thông báo cập nhật bình luận tới tất cả client
            await Clients.All.SendAsync("UpdateComment", comment);
        }

        public async Task DeleteComment(string commentId)
        {
            // Gửi thông báo xóa bình luận tới tất cả client
            await Clients.All.SendAsync("DeleteComment", commentId);
        }

        public async Task ReceiveAllComments(List<string> comments)
        {
            // Gửi danh sách bình luận tới tất cả client
            await Clients.All.SendAsync("ReceiveAllComments", comments);
        }
        public async Task GetTotalComments(int comments)
        {
            // Gửi danh sách tổng số lượng bình luận tới tất cả client
            await Clients.All.SendAsync("GetTotalComments", comments);
        }
    }
}
