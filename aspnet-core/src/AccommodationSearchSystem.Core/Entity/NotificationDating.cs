using Abp.Domain.Entities.Auditing;
using Abp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations.Schema;

namespace AccommodationSearchSystem.Entity
{
    [Table("NotificationDating")]
    public class NotificationDating : FullAuditedEntity<long>, IEntity<long>
    {
        public string NotiDatingName { get; set; }
        public int DatingId { get; set; }
        public DateTime CreateAt { get; set; }
        public DateTime UpdateAt { get; set; }
        public int? TenantId { get; set; }
    }
}
