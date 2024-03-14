using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AccommodationSearchSystem.AccommodationSearchSystem.ManageAppointmentSchedules.Dto
{
    public class GetScheduleForEditOutput
    {
        public CreateOrEditSchedulesDto CreateOrEditSchedulesDtos { get; set; }
        public GetAllSchedulesDto GetAllSchedulesDtos { get; set; }
        public ConfirmSchedulesDto ConfirmSchedulesDtos { get; set; }
        public CancelSchedulesDto CancelSchedulesDtos { get; set; }

    }
}
