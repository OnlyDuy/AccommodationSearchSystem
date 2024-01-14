using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using AccommodationSearchSystem.MultiTenancy;

namespace AccommodationSearchSystem.Sessions.Dto
{
    [AutoMapFrom(typeof(Tenant))]
    public class TenantLoginInfoDto : EntityDto
    {
        public string TenancyName { get; set; }

        public string Name { get; set; }
    }
}
