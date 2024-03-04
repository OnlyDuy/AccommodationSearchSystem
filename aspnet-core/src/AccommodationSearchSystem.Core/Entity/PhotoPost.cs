using Abp.Authorization.Users;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AccommodationSearchSystem.Entity
{
    [Table("PhotoPost")]
    public class PhotoPost
    {
        public int Id { get; set; }
        public string Url { get; set; }
        public bool IsMain { get; set; }
        public string? PublicId { get; set; }
        public Post Post { get; set; }
        public int PostId { get; set; }
    }
}
