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
    [Table("Accommodate")]
    public class Accommodate : FullAuditedEntity<long>, IEntity<long>
    {
        public int? TenantId { get; set; }
        public int PostId { get; set; }
        public decimal RoomPrice { get; set; } // Giá phòng
        [StringLength(4000)]
        public string Address { get; set; }
        [StringLength(4000)]
        public string Area { get; set; }
        public decimal Square { get; set; }
        public bool RoomStatus { get; set; }
        public string PriceCategory { get; set; } // Loại phòng
        public bool Wifi { get; set; } // Có wifi hay không
        public bool Parking { get; set; } // Có chỗ để xe hay không
        public bool Conditioner { get; set; } // Có điều hóa hay không
    }
}
