using Abp.Authorization;
using Abp.Localization;
using Abp.MultiTenancy;

namespace AccommodationSearchSystem.Authorization
{
    public class AccommodationSearchSystemAuthorizationProvider : AuthorizationProvider
    {
        public override void SetPermissions(IPermissionDefinitionContext context)
        {
            context.CreatePermission(PermissionNames.Pages_Users, L("Users"));
            context.CreatePermission(PermissionNames.Pages_Users_Activation, L("UsersActivation"));
            context.CreatePermission(PermissionNames.Pages_Roles, L("Roles"));
            context.CreatePermission(PermissionNames.Pages_Posts, L("Posts"));
            context.CreatePermission(PermissionNames.Pages_View_Posts, L("ViewPosts"));
            context.CreatePermission(PermissionNames.Pages_Personal_Information, L("PersonalInformation"));
            context.CreatePermission(PermissionNames.Pages_Manage_Appointment_Schedules, L("ManageAppointmentSchedules"));
            context.CreatePermission(PermissionNames.Pages_Posting_Packages, L("PostingPackage"));
            context.CreatePermission(PermissionNames.Pages_Tenants, L("Tenants"), multiTenancySides: MultiTenancySides.Host);
        }

        private static ILocalizableString L(string name)
        {
            return new LocalizableString(name, AccommodationSearchSystemConsts.LocalizationSourceName);
        }
    }
}
