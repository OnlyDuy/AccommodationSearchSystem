using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AccommodationSearchSystem.AccommodationSearchSystem.ManagePosts.Dto
{
    public class GetPostInputDto : PagedAndSortedResultRequestDto
    {
        public string filterText { get; set; }
        public string PriceCategory { get; set; } // Loại phòng
        public decimal Square { get; set; }
        public string District { get; set; }
        public decimal RoomPrice { get; set; } // Giá phòng

    }
}
