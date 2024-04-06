using Abp.Application.Services;
using Abp.Application.Services.Dto;
using AccommodationSearchSystem.AccommodationSearchSystem.ManageAppointmentSchedules.Dto;
using AccommodationSearchSystem.AccommodationSearchSystem.UserComment.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AccommodationSearchSystem.AccommodationSearchSystem.UserComment
{
    public interface IUserCommentAppService : IApplicationService
    {
        Task<UserCommentDto> AddComment(long postId, UserCommentDto input);
        Task<List<UserCommentViewDto>> GetAllComment(long postId);
        Task DeleteComment(EntityDto<long> input);
    }
}
