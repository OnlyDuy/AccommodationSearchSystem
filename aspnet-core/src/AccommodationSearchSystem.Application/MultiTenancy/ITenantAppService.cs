using Abp.Application.Services;
using AccommodationSearchSystem.MultiTenancy.Dto;

namespace AccommodationSearchSystem.MultiTenancy
{
    public interface ITenantAppService : IAsyncCrudAppService<TenantDto, int, PagedTenantResultRequestDto, CreateTenantDto, TenantDto>
    {
    }
}

