using Abp.Application.Services.Dto;
using Abp.Authorization.Users;
using Abp.AutoMapper;
using AccommodationSearchSystem.MultiTenancy;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AccommodationSearchSystem.Sessions.Dto
{
    [AutoMapFrom(typeof(UserRole))]
    public class RoleUserLoginDto : EntityDto
    {
        public int? TenantId { get; set; }

        public long UserId { get; set; }

        public int RoleId { get; set; }
    }
}
