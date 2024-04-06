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
    [Table("UserComment")]
    public class UserComments : FullAuditedEntity<long>, IEntity<long>
    {
        public int? TenantId { get; set; }
        public long UserId { get; set; }
        public long PostId { get; set; }
        public string CommentContent { get; set; }
    }
}
