using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AccommodationSearchSystem.AccommodationSearchSystem.ManagePosts.Dto
{
    public class PostLikeDto : EntityDto<long?>
    {
        public int? TenantId { get; set; }
        public int HostId { get; set; } // Id Người tìm trọ
        public int PostId { get; set; } // Id bài đăng
        public bool Like { get; set; }

        public int Count { get; set; }
    }
}
