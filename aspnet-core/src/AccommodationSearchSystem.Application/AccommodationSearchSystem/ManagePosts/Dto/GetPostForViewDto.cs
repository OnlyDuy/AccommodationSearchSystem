using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AccommodationSearchSystem.AccommodationSearchSystem.ManagePosts.Dto
{
    public class GetPostForViewDto : EntityDto<long?>
    {
        public int? PostId { get; set; }
        public string EmailAddress { get; set; }
        public string PhoneNumber { get; set; }
        public string Name { get; set; }
        public string Title { get; set; }
        public string ContentPost { get; set; }
        public string Photo { get; set; }
        public decimal RoomPrice { get; set; } // Giá phòng
        public string Address { get; set; }
        [StringLength(4000)]
        public string Area { get; set; }
        public decimal Square { get; set; }
        public string PriceCategory { get; set; } // Loại phòng
        public bool Wifi { get; set; } // Có wifi hay không
        public bool Parking { get; set; } // Có chỗ để xe hay không
        public bool Conditioner { get; set; } // Có điều hóa hay không
        public bool RoomStatus { get; set; }
        public bool IsDeleted { get; set; }
    }
}
