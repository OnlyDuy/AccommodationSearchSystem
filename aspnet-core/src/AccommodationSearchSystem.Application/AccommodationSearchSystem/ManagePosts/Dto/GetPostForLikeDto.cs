using Abp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AccommodationSearchSystem.AccommodationSearchSystem.ManagePosts.Dto
{
    public class GetPostForLikeDto : Entity<long?>
    {
        public int LikeId { get; set; }
        public int HostId { get; set; } // Id Người tìm trọ
        public int PostId { get; set; } // Id bài đăng
        public bool Like { get; set; }
        public int? TenantId { get; set; }
        public string Title { get; set; }
        public string ContentPost { get; set; }
        public decimal RoomPrice { get; set; } // Giá phòng
        public string Address { get; set; }
        [StringLength(4000)]
        public string District { get; set; }
        [StringLength(4000)]
        public string City { get; set; }
        [StringLength(4000)]
        public string Ward { get; set; }
        [StringLength(4000)]
        public decimal Square { get; set; }
        public string PriceCategory { get; set; } // Loại phòng
        public bool Wifi { get; set; } // Có wifi hay không
        public bool Parking { get; set; } // Có chỗ để xe hay không
        public bool Conditioner { get; set; } // Có điều hóa hay không
        public bool RoomStatus { get; set; }
        public ICollection<PhotoDto> Photos { get; set; }
        public string CreateByName { get; set; }
        public string EmailAddress { get; set; }
        public string PhoneNumber { get; set; }
        public string PackageType { get; set; }

    }
}
