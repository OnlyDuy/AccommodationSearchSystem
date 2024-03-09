using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AccommodationSearchSystem.AccommodationSearchSystem.ManageAppointmentSchedules.Dto
{
    public class GetSchedulesInputDto : PagedAndSortedResultRequestDto
    {
        public string filterText { get; set; }
    }
}
