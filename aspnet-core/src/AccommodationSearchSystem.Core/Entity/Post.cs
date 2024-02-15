using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AccommodationSearchSystem.Entity
{
    [Table("Post")]
    public class Post : FullAuditedEntity<long>, IEntity<long>
    {
        public int? TenantId { get; set; }
        [StringLength(4000)]
        public int AccommodateId { get; set; }
        public string Title { get; set; }
        [StringLength(4000)]
        public string ContentPost { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public bool IsDeleted { get; set; }
        public string Photo { get; set; }

    }
}
