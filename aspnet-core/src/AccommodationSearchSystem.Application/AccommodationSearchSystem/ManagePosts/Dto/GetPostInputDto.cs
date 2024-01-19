using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AccommodationSearchSystem.AccommodationSearchSystem.ManagePosts.Dto
{
    public class GetPostInputDto : EntityDto<long?>
    {
        public decimal RoomPrice { get; set; } // Giá phòng
        [StringLength(4000)]
        public string Address { get; set; }
        [StringLength(4000)]
        public decimal Square { get; set; }
        public bool RoomStatus { get; set; }
        public string PriceCategory { get; set; } // Loại phòng
        public bool Wifi { get; set; } // Có wifi hay không
        public bool Parking { get; set; } // Có chỗ để xe hay không
        public bool Conditioner { get; set; } // Có điều hóa hay không
    }
}
