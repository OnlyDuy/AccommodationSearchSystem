﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AccommodationSearchSystem.AccommodationSearchSystem.ManagePosts.Dto
{
    public class GetPostForEditOutput
    {
        public CreateOrEditIPostDto CreateOrEditPost { get; set; }
        public GetPostForViewDto GetPostForView { get; set; }
        public ICollection<PhotoDto> Photos { get; set; }
    }
}
