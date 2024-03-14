using Abp.Domain.Entities.Auditing;
using Abp.Domain.Entities;
using AccommodationSearchSystem.Authorization.Users;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AccommodationSearchSystem.Entity
{
    [Table("AppointmentSchedule")]
    public class AppointmentSchedule : FullAuditedEntity<long>, IEntity<long>
    {
        public User Users { get; set; }
        public int HostId { get; set; } // Id chủ trọ
        public string HostName { get; set; } // Tên chủ trọ
        public string HostPhoneNumber { get; set; } // Số điện thoại chủ trọ
        public string RenterHostName { get; set; } // Tên người thuê
        public string RenterHostPhoneNumber { get; set; } // Số điện thoại người thuê
        public DateTime Day { get; set; }
        public DateTime Hour { get; set; }
        public bool Confirm { get; set; }
        public int? TenantId { get; set; }
        public Post Posts { get; set; }
        public int PostId { get; set; } // Id bài đăng
        public bool Cancel { get; set; }
        public int CancelById { get; set; }

    }
}
