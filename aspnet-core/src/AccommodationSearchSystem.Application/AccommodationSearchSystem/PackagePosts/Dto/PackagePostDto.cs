using Abp.Application.Services.Dto;
using AccommodationSearchSystem.Authorization.Users;
using AccommodationSearchSystem.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AccommodationSearchSystem.AccommodationSearchSystem.PackagePosts.Dto
{
    public class PackagePostDto : EntityDto<long?>
    {
        public int HostId { get; set; } // Id chủ trọ
        public string HostName { get; set; } // Tên chủ trọ
        public string HostPhoneNumber { get; set; } // Số điện thoại chủ trọ
        public string PackageType { get; set; } // Loại gói
        public string PackageDetail { get; set; } // Nội dung gói
        public DateTime ExpirationDate { get; set; }
        public bool Confirm { get; set; }
        public int? TenantId { get; set; }
        public bool Cancel { get; set; }
        public int PostId { get; set; } // Id bài đăng

    }
}
