using Abp.Application.Services;
using Abp.Application.Services.Dto;
using AccommodationSearchSystem.AccommodationSearchSystem.ManagePosts.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AccommodationSearchSystem.AccommodationSearchSystem.ManagePosts
{
    public interface IManagePostsAppService : IApplicationService
    {
        Task CreateOrEdit(CreateOrEditIPostDto input);
        Task<PagedResultDto<GetPostForViewDto>> GetAll(GetPostInputDto input);
    }
}
