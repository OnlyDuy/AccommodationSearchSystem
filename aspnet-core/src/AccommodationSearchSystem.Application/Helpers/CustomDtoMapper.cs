using Abp.Authorization.Users;
using AccommodationSearchSystem.AccommodationSearchSystem.ManagePosts.Dto;
using AccommodationSearchSystem.Entity;
using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AccommodationSearchSystem.Helpers
{
    public class CustomDtoMapper : Profile
    {
        public static void CreateMappings(IMapperConfigurationExpression configuration)
        {
            configuration.CreateMap<Post, CreateOrEditIPostDto>().ReverseMap();
            configuration.CreateMap<Accommodate, CreateOrEditIPostDto>().ReverseMap();
        }
    }
}
