using Abp.Application.Services;
using Abp.Application.Services.Dto;
using AccommodationSearchSystem.AccommodationSearchSystem.ManageAppointmentSchedules.Dto;
using AccommodationSearchSystem.AccommodationSearchSystem.ManagePosts.Dto;
using AccommodationSearchSystem.AccommodationSearchSystem.PackagePosts.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AccommodationSearchSystem.AccommodationSearchSystem.PackagePosts
{
    public interface IPackagePostsAppService : IApplicationService
    {
        Task<PagedResultDto<GetPackageViewDto>> GetAll(GetPackageInputDto input);
        Task CreatePackage(PackagePostDto input);
        Task CancelPackage(CancelPostDto input);
        Task ConfirmPackage(ConfirmPackageDto input);
        Task DeletePackage(EntityDto<long> input);
    }
}
