using Microsoft.EntityFrameworkCore;
using Abp.Zero.EntityFrameworkCore;
using AccommodationSearchSystem.Authorization.Users;
using AccommodationSearchSystem.MultiTenancy;
using AccommodationSearchSystem.Entity;
using AccommodationSearchSystem.Authorization.Roles;
using Abp.Authorization.Users;
using Abp.IdentityServer4;

namespace AccommodationSearchSystem.EntityFrameworkCore
{
    public class AccommodationSearchSystemDbContext : AbpZeroDbContext<Tenant, Role, User, AccommodationSearchSystemDbContext>
    {
        /* Define a DbSet for each entity of the application */

        public virtual DbSet<Post> Posts { get; set; }
        public virtual DbSet<PhotoPost> PhotoPosts { get; set; }
        public virtual DbSet<Accommodate> Accommodates { get; set; }
        public virtual DbSet<Notification> Notifications { get; set; }
        public virtual DbSet<NotificationDating> NotificationDatings { get; set; }
        public virtual DbSet<AppointmentSchedule> AppointmentSchedules { get; set; }
        public virtual DbSet<PackagePost> PackagePosts { get; set; }
        public virtual DbSet<UserLikePost> UserLikePosts { get; set; }


        //public virtual DbSet<UserRole> UserRoles { get; set; }


        public AccommodationSearchSystemDbContext(DbContextOptions<AccommodationSearchSystemDbContext> options)
            : base(options)
        {
        }
    }
}
