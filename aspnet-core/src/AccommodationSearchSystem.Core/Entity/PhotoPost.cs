using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using System.ComponentModel.DataAnnotations.Schema;

namespace AccommodationSearchSystem.Entity
{
    [Table("PhotoPost")]
    public class PhotoPost : FullAuditedEntity<long>, IEntity<long>
    {
        public string Url { get; set; }
        public bool IsMain { get; set; }
        public string? PublicId { get; set; }
        public Post Post { get; set; }
        public int PostId { get; set; }
    }
}
