using Abp.Authorization;
using AccommodationSearchSystem.Authorization.Roles;
using AccommodationSearchSystem.Authorization.Users;

namespace AccommodationSearchSystem.Authorization
{
    public class PermissionChecker : PermissionChecker<Role, User>
    {
        public PermissionChecker(UserManager userManager)
            : base(userManager)
        {
        }
    }
}
