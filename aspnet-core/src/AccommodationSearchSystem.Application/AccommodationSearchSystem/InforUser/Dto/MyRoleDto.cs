//using Abp.Authorization.Roles;
//using Abp.Domain.Entities;
//using AccommodationSearchSystem.Authorization.Roles;
//using System;
//using System.Collections.Generic;
//using System.ComponentModel.DataAnnotations;
//using System.Linq;
//using System.Text;
//using System.Threading.Tasks;

//namespace AccommodationSearchSystem.AccommodationSearchSystem.InforUser.Dto
//{
//    public class MyRoleDto : Entity<long>
//    {

//        [Required]
//        [StringLength(AbpRoleBase.MaxNameLength)]
//        public string Name { get; set; }

//        [Required]
//        [StringLength(AbpRoleBase.MaxDisplayNameLength)]
//        public string DisplayName { get; set; }

//        public string NormalizedName { get; set; }

//        [StringLength(Role.MaxDescriptionLength)]
//        public string Description { get; set; }
//    }
//}
