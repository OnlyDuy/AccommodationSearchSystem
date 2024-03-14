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
        Task UpdateSchedule(CreateOrEditSchedulesDto input);
        Task EditSchedule(CreateOrEditSchedulesDto input);
        Task<PagedResultDto<GetAllSchedulesDto>> GetAll(GetSchedulesInputDto input);
        Task<PagedResultDto<GetAllSchedulesDto>> GetAllScheduleSuccess(GetSchedulesInputDto input);
        Task ConfirmSchedules(ConfirmSchedulesDto input);
        Task CancelSchedules(CancelSchedulesDto input);
        Task<GetScheduleForEditOutput> GetScheduleForEdit(EntityDto<long> input);
        Task DeleteSchedule(EntityDto<long> input);
        Task<PagedResultDto<GetAllSchedulesDto>> GetAllScheduleCancelByHost(GetSchedulesInputDto input);
        Task<PagedResultDto<GetAllSchedulesDto>> GetAllScheduleCancelByRenter(GetSchedulesInputDto input);
    }
}
