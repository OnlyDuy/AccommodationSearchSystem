using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AccommodationSearchSystem.AccommodationSearchSystem.ManagePosts.Dto
{
    public class ConfirmPostByAdminDto : EntityDto<long>
    {
        public int? TenantId { get; set; }
        public int CreatorUserId { get; set; }
        public bool ConfirmAdmin { get; set; }
    }
}
