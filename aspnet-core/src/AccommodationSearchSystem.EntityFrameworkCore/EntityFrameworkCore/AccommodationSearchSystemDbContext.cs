using Microsoft.EntityFrameworkCore;
using Abp.Zero.EntityFrameworkCore;
using AccommodationSearchSystem.Authorization.Roles;
using AccommodationSearchSystem.Authorization.Users;
using AccommodationSearchSystem.MultiTenancy;

namespace AccommodationSearchSystem.EntityFrameworkCore
{
    public class AccommodationSearchSystemDbContext : AbpZeroDbContext<Tenant, Role, User, AccommodationSearchSystemDbContext>
    {
        /* Define a DbSet for each entity of the application */
        
        public AccommodationSearchSystemDbContext(DbContextOptions<AccommodationSearchSystemDbContext> options)
            : base(options)
        {
        }
    }
}
