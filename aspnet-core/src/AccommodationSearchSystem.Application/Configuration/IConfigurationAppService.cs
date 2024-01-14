using System.Threading.Tasks;
using AccommodationSearchSystem.Configuration.Dto;

namespace AccommodationSearchSystem.Configuration
{
    public interface IConfigurationAppService
    {
        Task ChangeUiTheme(ChangeUiThemeInput input);
    }
}
