using System.Threading.Tasks;
using Abp.Authorization;
using Abp.Runtime.Session;
using AccommodationSearchSystem.Configuration.Dto;

namespace AccommodationSearchSystem.Configuration
{
    [AbpAuthorize]
    public class ConfigurationAppService : AccommodationSearchSystemAppServiceBase, IConfigurationAppService
    {
        public async Task ChangeUiTheme(ChangeUiThemeInput input)
        {
            await SettingManager.ChangeSettingForUserAsync(AbpSession.ToUserIdentifier(), AppSettingNames.UiTheme, input.Theme);
        }
    }
}
