using Microsoft.Extensions.Configuration;
using Castle.MicroKernel.Registration;
using Abp.Events.Bus;
using Abp.Modules;
using Abp.Reflection.Extensions;
using AccommodationSearchSystem.Configuration;
using AccommodationSearchSystem.EntityFrameworkCore;
using AccommodationSearchSystem.Migrator.DependencyInjection;

namespace AccommodationSearchSystem.Migrator
{
    [DependsOn(typeof(AccommodationSearchSystemEntityFrameworkModule))]
    public class AccommodationSearchSystemMigratorModule : AbpModule
    {
        private readonly IConfigurationRoot _appConfiguration;

        public AccommodationSearchSystemMigratorModule(AccommodationSearchSystemEntityFrameworkModule abpProjectNameEntityFrameworkModule)
        {
            abpProjectNameEntityFrameworkModule.SkipDbSeed = true;

            _appConfiguration = AppConfigurations.Get(
                typeof(AccommodationSearchSystemMigratorModule).GetAssembly().GetDirectoryPathOrNull()
            );
        }

        public override void PreInitialize()
        {
            Configuration.DefaultNameOrConnectionString = _appConfiguration.GetConnectionString(
                AccommodationSearchSystemConsts.ConnectionStringName
            );

            Configuration.BackgroundJobs.IsJobExecutionEnabled = false;
            Configuration.ReplaceService(
                typeof(IEventBus), 
                () => IocManager.IocContainer.Register(
                    Component.For<IEventBus>().Instance(NullEventBus.Instance)
                )
            );
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(AccommodationSearchSystemMigratorModule).GetAssembly());
            ServiceCollectionRegistrar.Register(IocManager);
        }
    }
}
