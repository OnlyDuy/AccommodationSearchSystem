//using Abp.Authorization.Users;
//using Abp.Domain.Entities;
//using System;
//using System.Collections.Generic;
//using System.ComponentModel.DataAnnotations;
//using System.Linq;
//using System.Text;
//using System.Threading.Tasks;

//namespace AccommodationSearchSystem.AccommodationSearchSystem.InforUser.Dto
//{
//    public class MyUserDto : Entity<long>
//    {
//        public long Id { get; set; }

//        [Required]
//        [StringLength(AbpUserBase.MaxUserNameLength)]
//        public string UserName { get; set; }

//        [Required]
//        [StringLength(AbpUserBase.MaxNameLength)]
//        public string Name { get; set; }

//        [Required]
//        [StringLength(AbpUserBase.MaxSurnameLength)]
//        public string Surname { get; set; }

//        [Required]
//        [EmailAddress]
//        [StringLength(AbpUserBase.MaxEmailAddressLength)]
//        public string EmailAddress { get; set; }

//        [Required]
//        [RegularExpression(@"^0\d{9}$", ErrorMessage = "Invalid phone number format")]
//        public string PhoneNumber { get; set; }

//        public bool IsActive { get; set; }

//        public string FullName { get; set; }

//        public DateTime? LastLoginTime { get; set; }

//        public DateTime CreationTime { get; set; }

//        public string[] RoleNames { get; set; }
//    }
//}
