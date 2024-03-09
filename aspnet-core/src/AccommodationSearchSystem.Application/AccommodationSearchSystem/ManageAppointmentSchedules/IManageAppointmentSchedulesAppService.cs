using Abp.Application.Services;
using Abp.Application.Services.Dto;
using AccommodationSearchSystem.AccommodationSearchSystem.ManageAppointmentSchedules.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AccommodationSearchSystem.AccommodationSearchSystem.ManageAppointmentSchedules
{
    public interface IManageAppointmentSchedulesAppService : IApplicationService
    {
        Task<CreateOrEditSchedulesDto> CreateSchedule(EntityDto<long> input);
        Task EditSchedule(CreateOrEditSchedulesDto input);
        Task<PagedResultDto<GetAllSchedulesDto>> GetAll(GetSchedulesInputDto input);
        Task ConfirmRateFinal(ConfirmSchedulesDto input);
    }
}
