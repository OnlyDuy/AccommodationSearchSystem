using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AccommodationSearchSystem.Helpers
{
    internal class CustomDtoMapper : Profile
    {
        public static void CreateMappings(IMapperConfigurationExpression configuration)
        {
            //configuration.CreateMap<OdsItem, CreateOrEditItemDto>().ReverseMap();
        }
    }
}
