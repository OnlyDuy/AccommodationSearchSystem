using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AccommodationSearchSystem.AccommodationSearchSystem.PackagePosts.Dto
{
    public class GetPackageInputDto : PagedAndSortedResultRequestDto
    {
        public string filterText { get; set; }
    }
}
