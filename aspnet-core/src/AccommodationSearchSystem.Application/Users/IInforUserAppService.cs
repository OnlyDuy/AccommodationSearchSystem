using Abp.Application.Services;
using Abp.Application.Services.Dto;
using AccommodationSearchSystem.Roles.Dto;
using AccommodationSearchSystem.Users.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AccommodationSearchSystem.Users
{
    public interface IInforUserAppService : IAsyncCrudAppService<UserDto, long, PagedUserResultRequestDto, CreateUserDto, UserDto>
    {
        Task<ListResultDto<RoleDto>> GetInforRoles();
        Task ChangeInforLanguage(ChangeUserLanguageDto input);
        Task<bool> ChangeInforPassword(ChangePasswordDto input);
    }
}
