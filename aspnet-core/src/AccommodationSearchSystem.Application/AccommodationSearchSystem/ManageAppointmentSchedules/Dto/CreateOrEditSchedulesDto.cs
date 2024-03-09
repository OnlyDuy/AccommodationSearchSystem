using Abp.Application.Services.Dto;
using AccommodationSearchSystem.AccommodationSearchSystem.ManagePosts.Dto;
using AccommodationSearchSystem.Authorization.Users;
using AccommodationSearchSystem.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AccommodationSearchSystem.AccommodationSearchSystem.ManageAppointmentSchedules.Dto
{
    public class CreateOrEditSchedulesDto : EntityDto<long?>
    {
        public int? TenantId { get; set; }
        public int HostId { get; set; } // Id chủ trọ
        public string HostName { get; set; } // Tên chủ trọ
        public string HostPhoneNumber { get; set; } // Số điện thoại chủ trọ
        public string RenterHostName { get; set; } // Tên người thuê
        public string RenterHostPhoneNumber { get; set; } // Số điện thoại người thuê
        public DateTime Day { get; set; }
        public TimeSpan Hour { get; set; }
        public int PostId { get; set; } // Id bài đăng

        public GetPostForViewDto GetPostForViewDtos { get; set; }
    }

}
