using Microsoft.EntityFrameworkCore;
using Abp.Zero.EntityFrameworkCore;
using AccommodationSearchSystem.Authorization.Roles;
using AccommodationSearchSystem.Authorization.Users;
using AccommodationSearchSystem.MultiTenancy;
using AccommodationSearchSystem.Entity;

namespace AccommodationSearchSystem.EntityFrameworkCore
{
    public class AccommodationSearchSystemDbContext : AbpZeroDbContext<Tenant, Role, User, AccommodationSearchSystemDbContext>
    {
        /* Define a DbSet for each entity of the application */

        public virtual DbSet<Post> Posts { get; set; }
        public virtual DbSet<Accommodate> Accommodates { get; set; }
        public virtual DbSet<Service> Services { get; set; }
        public virtual DbSet<Notification> Notifications { get; set; }
        public virtual DbSet<NotificationDating> NotificationDatings { get; set; }

        public AccommodationSearchSystemDbContext(DbContextOptions<AccommodationSearchSystemDbContext> options)
            : base(options)
        {
        }
    }
}
