using AccommodationSearchSystem.AccommodationSearchSystem.ManagePosts.Dto;
using System.Security.Claims;

namespace AccommodationSearchSystem.Extensions
{
    public static class ClaimsPrincipleExtensions
    {
        public static string GetPostTitle(this ClaimsPrincipal post)
        {
            return post.FindFirst(ClaimTypes.Name)?.Value;
        }

        public static int GetPostId(this ClaimsPrincipal post)
        {
            return int.Parse(post.FindFirst(ClaimTypes.NameIdentifier)?.Value);
        }
    }
}
