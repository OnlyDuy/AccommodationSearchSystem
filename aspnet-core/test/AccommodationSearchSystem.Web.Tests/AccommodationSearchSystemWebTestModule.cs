using Abp.AspNetCore;
using Abp.AspNetCore.TestBase;
using Abp.Modules;
using Abp.Reflection.Extensions;
using AccommodationSearchSystem.EntityFrameworkCore;
using AccommodationSearchSystem.Web.Startup;
using Microsoft.AspNetCore.Mvc.ApplicationParts;

namespace AccommodationSearchSystem.Web.Tests
{
    [DependsOn(
        typeof(AccommodationSearchSystemWebMvcModule),
        typeof(AbpAspNetCoreTestBaseModule)
    )]
    public class AccommodationSearchSystemWebTestModule : AbpModule
    {
        public AccommodationSearchSystemWebTestModule(AccommodationSearchSystemEntityFrameworkModule abpProjectNameEntityFrameworkModule)
        {
            abpProjectNameEntityFrameworkModule.SkipDbContextRegistration = true;
        } 
        
        public override void PreInitialize()
        {
            Configuration.UnitOfWork.IsTransactional = false; //EF Core InMemory DB does not support transactions.
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(AccommodationSearchSystemWebTestModule).GetAssembly());
        }
        
        public override void PostInitialize()
        {
            IocManager.Resolve<ApplicationPartManager>()
                .AddApplicationPartsIfNotAddedBefore(typeof(AccommodationSearchSystemWebMvcModule).Assembly);
        }
    }
}