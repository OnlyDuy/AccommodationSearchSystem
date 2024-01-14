﻿using System.Threading.Tasks;
using Abp.Application.Services;
using AccommodationSearchSystem.Sessions.Dto;

namespace AccommodationSearchSystem.Sessions
{
    public interface ISessionAppService : IApplicationService
    {
        Task<GetCurrentLoginInformationsOutput> GetCurrentLoginInformations();
    }
}
