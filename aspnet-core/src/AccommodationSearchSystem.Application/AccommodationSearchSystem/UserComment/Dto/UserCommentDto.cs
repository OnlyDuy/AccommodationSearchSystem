using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AccommodationSearchSystem.AccommodationSearchSystem.UserComment.Dto
{
    public class UserCommentDto : EntityDto<long?>
    {
        public int? TenantId { get; set; }
        public long UserId { get; set; }
        public long PostId { get; set; }
        public string CommentContent { get; set; }
    }

    public class UserCommentViewDto : EntityDto<long?>
    {
        public int? TenantId { get; set; }
        public long UserId { get; set; }
        public long PostId { get; set; }
        public string CommentContent { get; set; }
        public string CreateByName { get; set; } // Tên người dùng
        public DateTime CreationTime { get; set; }
        public String TimeAgo { get; set; }

    }
}
