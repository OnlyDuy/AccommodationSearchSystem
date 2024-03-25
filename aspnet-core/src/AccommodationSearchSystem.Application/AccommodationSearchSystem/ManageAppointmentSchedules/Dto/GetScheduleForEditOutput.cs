using AccommodationSearchSystem.AccommodationSearchSystem.ManagePosts.Dto;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AccommodationSearchSystem.AccommodationSearchSystem.ManageAppointmentSchedules.Dto
{
    public class GetScheduleForEditOutput
    {
        public CreateOrEditSchedulesDto CreateOrEditSchedulesDtos { get; set; }
        public ConfirmSchedulesDto ConfirmSchedulesDtos { get; set; }
        public CancelSchedulesDto CancelSchedulesDtos { get; set; }
        public ICollection<PhotoDto> Photos { get; set; }
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

    }
}
