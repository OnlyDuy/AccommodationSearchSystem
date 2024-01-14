using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Abp.Modules;
using Abp.Reflection.Extensions;
using AccommodationSearchSystem.Configuration;

namespace AccommodationSearchSystem.Web.Host.Startup
{
    [DependsOn(
       typeof(AccommodationSearchSystemWebCoreModule))]
    public class AccommodationSearchSystemWebHostModule: AbpModule
    {
        private readonly IWebHostEnvironment _env;
        private readonly IConfigurationRoot _appConfiguration;

        public AccommodationSearchSystemWebHostModule(IWebHostEnvironment env)
        {
            _env = env;
            _appConfiguration = env.GetAppConfiguration();
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(AccommodationSearchSystemWebHostModule).GetAssembly());
        }
    }
}
