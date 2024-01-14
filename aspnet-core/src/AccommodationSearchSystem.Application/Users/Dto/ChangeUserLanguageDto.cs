using System.ComponentModel.DataAnnotations;

namespace AccommodationSearchSystem.Users.Dto
{
    public class ChangeUserLanguageDto
    {
        [Required]
        public string LanguageName { get; set; }
    }
}