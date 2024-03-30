using Abp.Domain.Entities.Auditing;
using Abp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AccommodationSearchSystem.Authorization.Users;

namespace AccommodationSearchSystem.Entity
{
    [Table("UserLikePost")]
    public class UserLikePost : FullAuditedEntity<long>, IEntity<long>
    {
        public User Users { get; set; }
        public int HostId { get; set; } // Id chủ trọ
        public Post Posts { get; set; }
        public int PostId { get; set; } // Id bài đăng
        public bool Like { get; set; }
        public int? TenantId { get; set; }
    }
}
