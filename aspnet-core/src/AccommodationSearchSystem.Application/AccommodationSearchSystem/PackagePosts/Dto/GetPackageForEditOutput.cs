using AccommodationSearchSystem.AccommodationSearchSystem.ManagePosts.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AccommodationSearchSystem.AccommodationSearchSystem.PackagePosts.Dto
{
    public class GetPackageForEditOutput
    {
        public GetPackageViewDto GetPackageViewDtos { get; set; }
        public ConfirmPackageDto ConfirmPackageDtos { get; set; }
        public CancelPostDto CancelPostDtos { get; set; }
    }
}
