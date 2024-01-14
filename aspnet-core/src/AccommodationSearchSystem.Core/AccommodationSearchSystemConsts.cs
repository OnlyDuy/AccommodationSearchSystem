using AccommodationSearchSystem.Debugging;

namespace AccommodationSearchSystem
{
    public class AccommodationSearchSystemConsts
    {
        public const string LocalizationSourceName = "AccommodationSearchSystem";

        public const string ConnectionStringName = "Default";

        public const bool MultiTenancyEnabled = true;


        /// <summary>
        /// Default pass phrase for SimpleStringCipher decrypt/encrypt operations
        /// </summary>
        public static readonly string DefaultPassPhrase =
            DebugHelper.IsDebug ? "gsKxGZ012HLL3MI5" : "a692c3f32ac44fdfabcbebf7b168e6aa";
    }
}
