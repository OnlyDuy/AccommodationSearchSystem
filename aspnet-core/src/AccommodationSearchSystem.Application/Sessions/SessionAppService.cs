using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Auditing;
using Abp.Authorization.Users;
using Abp.Domain.Repositories;
using Abp.Runtime.Session;
using AccommodationSearchSystem.Authorization.Users;
using AccommodationSearchSystem.Entity;
using AccommodationSearchSystem.EntityFrameworkCore;
using AccommodationSearchSystem.Sessions.Dto;
using Microsoft.EntityFrameworkCore;

namespace AccommodationSearchSystem.Sessions
{
    public class SessionAppService : AccommodationSearchSystemAppServiceBase, ISessionAppService
    {
        private readonly AccommodationSearchSystemDbContext _DbContext;
        private readonly IRepository<UserRole, long> _repositoryRole;

        public SessionAppService(AccommodationSearchSystemDbContext dbContext, IRepository<UserRole, long> repositoryRole)
        {
            _DbContext = dbContext;
            _repositoryRole = repositoryRole;
        }

        [DisableAuditing]
        public async Task<GetCurrentLoginInformationsOutput> GetCurrentLoginInformations()
        {
            var output = new GetCurrentLoginInformationsOutput
            {
                Application = new ApplicationInfoDto
                {
                    Version = AppVersionHelper.Version,
                    ReleaseDate = AppVersionHelper.ReleaseDate,
                    Features = new Dictionary<string, bool>()
                }
            };

            if (AbpSession.TenantId.HasValue)
            {
                output.Tenant = ObjectMapper.Map<TenantLoginInfoDto>(await GetCurrentTenantAsync());
            }

            if (AbpSession.UserId.HasValue)
            {
                var user = await GetCurrentUserAsync();
                output.User = ObjectMapper.Map<UserLoginInfoDto>(user);
              
                //var userRoles = await _DbContext.UserRoles.Where(u => u.UserId == user.Id).ToListAsync();
                //var userRoles = from s in _repositoryRole.GetAll().Where(e => e.UserId == user.Id)
                //                select new UserRoleDto
                //                {
                //                    RoleId = s.RoleId,
                //                    UserId = user.Id,
                //                    TenantId = user.TenantId
                //                };

                var userRoless = await _repositoryRole.FirstOrDefaultAsync(e => e.UserId == user.Id);
                output.UserRole = ObjectMapper.Map<RoleUserLoginDto>(userRoless);
                //foreach (var userRole in userRoles)
                //{
                //    output.User.Roles.Add(new UserRoleDto
                //    {
                //        RoleId = userRole.RoleId,
                //        UserId = userRole.UserId,
                //    });
                //}

            }

            return output;
        }
    }
}
