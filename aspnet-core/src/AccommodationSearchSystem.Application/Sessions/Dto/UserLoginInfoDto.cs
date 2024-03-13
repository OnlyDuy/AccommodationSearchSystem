using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using AccommodationSearchSystem.Authorization.Users;
using System.Collections.Generic;

namespace AccommodationSearchSystem.Sessions.Dto
{
    [AutoMapFrom(typeof(User))]
    public class UserLoginInfoDto : EntityDto<long>
    {
        public string Name { get; set; }

        public string Surname { get; set; }

        public string UserName { get; set; }

        public string EmailAddress { get; set; }

        public string PhoneNumber { get; set; }
        //public List<UserRoleDto> Roles { get; set; } // Thêm thuộc tính Roles

        //public UserLoginInfoDto()
        //{
        //    Roles = new List<UserRoleDto>();
        //}
    }

    //public class UserRoleDto
    //{
    //    public int? TenantId { get; set; }

    //    public long UserId { get; set; }
    //    public int RoleId { get; set; }
    //}
}
