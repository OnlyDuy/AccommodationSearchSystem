using Abp.AspNetCore.Mvc.Controllers;
using Abp.IdentityFramework;
using Microsoft.AspNetCore.Identity;

namespace AccommodationSearchSystem.Controllers
{
    public abstract class AccommodationSearchSystemControllerBase: AbpController
    {
        protected AccommodationSearchSystemControllerBase()
        {
            LocalizationSourceName = AccommodationSearchSystemConsts.LocalizationSourceName;
        }

        protected void CheckErrors(IdentityResult identityResult)
        {
            identityResult.CheckErrors(LocalizationManager);
        }
    }
}
