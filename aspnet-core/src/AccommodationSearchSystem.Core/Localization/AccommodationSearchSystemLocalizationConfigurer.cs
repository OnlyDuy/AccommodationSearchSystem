using Abp.Configuration.Startup;
using Abp.Localization.Dictionaries;
using Abp.Localization.Dictionaries.Xml;
using Abp.Reflection.Extensions;

namespace AccommodationSearchSystem.Localization
{
    public static class AccommodationSearchSystemLocalizationConfigurer
    {
        public static void Configure(ILocalizationConfiguration localizationConfiguration)
        {
            localizationConfiguration.Sources.Add(
                new DictionaryBasedLocalizationSource(AccommodationSearchSystemConsts.LocalizationSourceName,
                    new XmlEmbeddedFileLocalizationDictionaryProvider(
                        typeof(AccommodationSearchSystemLocalizationConfigurer).GetAssembly(),
                        "AccommodationSearchSystem.Localization.SourceFiles"
                    )
                )
            );
        }
    }
}
