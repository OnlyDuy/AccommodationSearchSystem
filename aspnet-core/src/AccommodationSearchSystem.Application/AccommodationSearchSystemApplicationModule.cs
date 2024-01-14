using Abp.AutoMapper;
using Abp.Modules;
using Abp.Reflection.Extensions;
using AccommodationSearchSystem.Authorization;

namespace AccommodationSearchSystem
{
    [DependsOn(
        typeof(AccommodationSearchSystemCoreModule), 
        typeof(AbpAutoMapperModule))]
    public class AccommodationSearchSystemApplicationModule : AbpModule
    {
        public override void PreInitialize()
        {
            Configuration.Authorization.Providers.Add<AccommodationSearchSystemAuthorizationProvider>();
        }

        public override void Initialize()
        {
            var thisAssembly = typeof(AccommodationSearchSystemApplicationModule).GetAssembly();

            IocManager.RegisterAssemblyByConvention(thisAssembly);

            Configuration.Modules.AbpAutoMapper().Configurators.Add(
                // Scan the assembly for classes which inherit from AutoMapper.Profile
                cfg => cfg.AddMaps(thisAssembly)
            );
        }
    }
}
