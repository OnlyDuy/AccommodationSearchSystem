using Abp.Application.Services.Dto;

namespace AccommodationSearchSystem.Roles.Dto
{
    public class PagedRoleResultRequestDto : PagedResultRequestDto
    {
        public string Keyword { get; set; }
    }
}

