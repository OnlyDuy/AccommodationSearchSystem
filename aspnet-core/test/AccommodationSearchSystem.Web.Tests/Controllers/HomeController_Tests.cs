using System.Threading.Tasks;
using AccommodationSearchSystem.Models.TokenAuth;
using AccommodationSearchSystem.Web.Controllers;
using Shouldly;
using Xunit;

namespace AccommodationSearchSystem.Web.Tests.Controllers
{
    public class HomeController_Tests: AccommodationSearchSystemWebTestBase
    {
        [Fact]
        public async Task Index_Test()
        {
            await AuthenticateAsync(null, new AuthenticateModel
            {
                UserNameOrEmailAddress = "admin",
                Password = "123qwe"
            });

            //Act
            var response = await GetResponseAsStringAsync(
                GetUrl<HomeController>(nameof(HomeController.Index))
            );

            //Assert
            response.ShouldNotBeNullOrEmpty();
        }
    }
}