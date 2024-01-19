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
    public class ManagePostsAppService : ApplicationService, IManagePostsAppService
    {
        public Task CreateOrEdit(CreateOrEditIPostDto input)
        {
            throw new NotImplementedException();
        }

        public Task<PagedResultDto<GetPostForViewDto>> GetAll(GetPostInputDto input)
        {
            throw new NotImplementedException();
        }
    }
}
