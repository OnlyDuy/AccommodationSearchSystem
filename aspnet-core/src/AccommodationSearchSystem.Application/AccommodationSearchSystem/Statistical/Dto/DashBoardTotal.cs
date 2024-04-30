using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AccommodationSearchSystem.AccommodationSearchSystem.Statistical.Dto
{
    public class DashBoardTotal
    {
        public int Value { get; set; }
    }

    public class DashBoardTotalUser
    {
        public int TotalUser { get; set; }
    }
    public class DashBoardTotalPost
    {
        public int TotalPost { get; set; }
        public int TotalPostLike { get; set; }

    }
    public class DashBoardTotalBooking
    {
        public int TotalBooking { get; set; }
    }

    public class PostCategoryDto
    {
        public string PriceCategory { get; set; } // Loại phòng
        public int Count { get; set; }
    }

    public class PostCountByMonthDto : EntityDto<long>
    {
        public int Year { get; set; }
        public int Month { get; set; }
        public int PostCount { get; set; }
    }
    public class ScheduleCountByMonthDto
    {
        public int Month { get; set; }
        public int Year { get; set; }
        public int SuccessfulCount { get; set; }
        public int CancelledByHostCount { get; set; }
        public int CancelledByTenantCount { get; set; }
    }

    public class UserPostCountDto : EntityDto<long>
    {
        public long UserId { get; set; }
        public string FullName { get; set; }
        public int PostCount { get; set; }
    }

    public class UserScheduleCountDto : EntityDto<long>
    {
        public long UserId { get; set; }
        public string FullName { get; set; }
        public int ScheduleCount { get; set; }
    }
}
