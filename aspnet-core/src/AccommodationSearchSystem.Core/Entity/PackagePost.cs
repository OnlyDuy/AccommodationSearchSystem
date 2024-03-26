using Abp.Domain.Entities.Auditing;
using Abp.Domain.Entities;
using AccommodationSearchSystem.Authorization.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations.Schema;

namespace AccommodationSearchSystem.Entity
{
    [Table("PackagePost")]
    public class PackagePost : FullAuditedEntity<long>, IEntity<long>
    {
        public User Users { get; set; }
        public int HostId { get; set; } // Id chủ trọ
        public string HostName { get; set; } // Tên chủ trọ
        public string HostPhoneNumber { get; set; } // Số điện thoại chủ trọ
        public string PackageType { get; set; } // Loại gói
        public string PackageDetail { get; set; } // Nội dung gói
        public DateTime ExpirationDate { get; set; }
        public bool Confirm { get; set; }
        public int? TenantId { get; set; }
        public bool Cancel { get; set; }
        public Post Posts { get; set; }
        public int PostId { get; set; } // Id bài đăng

    }
}
