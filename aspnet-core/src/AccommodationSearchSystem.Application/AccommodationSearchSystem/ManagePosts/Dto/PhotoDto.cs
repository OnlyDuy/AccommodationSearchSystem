using Abp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AccommodationSearchSystem.AccommodationSearchSystem.ManagePosts.Dto
{
    public class PhotoDto : Entity<long?>
    {
        public string Url { get; set; }
        public bool IsMain { get; set; }
        public int PostId { get; set; }
        public bool Selected { get; set; }
    }
}
