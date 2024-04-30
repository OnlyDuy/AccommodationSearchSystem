using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AccommodationSearchSystem.AccommodationSearchSystem.PackagePosts.Dto
{
    public class ConfirmPackageDto : EntityDto<long?>
    {
        public int? TenantId { get; set; }
        public int HostId { get; set; }
        public int CreatorUserId { get; set; }
        public bool Confirm { get; set; }
    }
}
