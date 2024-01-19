using Abp.Domain.Entities.Auditing;
using Abp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AccommodationSearchSystem.Entity
{
    [Table("Service")]
    public class Service : FullAuditedEntity<long>, IEntity<long>
    {
        [Required]
        public int ServiceId { get; set; }
        [StringLength(4000)]
        public string NameService { get; set; }
    }
}
