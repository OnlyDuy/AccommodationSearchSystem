using Abp.Authorization.Users;
using AccommodationSearchSystem.AccommodationSearchSystem.ManageAppointmentSchedules.Dto;
using AccommodationSearchSystem.AccommodationSearchSystem.ManagePosts.Dto;
using AccommodationSearchSystem.Entity;
using AccommodationSearchSystem.Sessions.Dto;
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
            configuration.CreateMap<AppointmentSchedule, CreateOrEditSchedulesDto>().ReverseMap();
            configuration.CreateMap<AppointmentSchedule, GetAllSchedulesDto>().ReverseMap();
            configuration.CreateMap<PhotoPost, PhotoDto>().ReverseMap();
            //configuration.CreateMap<UserRole, UserRoleDto>().ReverseMap();

        }
    }
}
