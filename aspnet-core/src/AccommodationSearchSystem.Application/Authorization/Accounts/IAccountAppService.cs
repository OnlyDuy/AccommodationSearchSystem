using System.Threading.Tasks;
using Abp.Application.Services;
using AccommodationSearchSystem.Authorization.Accounts.Dto;

namespace AccommodationSearchSystem.Authorization.Accounts
{
    public interface IAccountAppService : IApplicationService
    {
        Task<IsTenantAvailableOutput> IsTenantAvailable(IsTenantAvailableInput input);

        Task<RegisterOutput> Register(RegisterInput input);
    }
}
