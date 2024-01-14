using System.Data.Common;
using Microsoft.EntityFrameworkCore;

namespace AccommodationSearchSystem.EntityFrameworkCore
{
    public static class AccommodationSearchSystemDbContextConfigurer
    {
        public static void Configure(DbContextOptionsBuilder<AccommodationSearchSystemDbContext> builder, string connectionString)
        {
            builder.UseSqlServer(connectionString);
        }

        public static void Configure(DbContextOptionsBuilder<AccommodationSearchSystemDbContext> builder, DbConnection connection)
        {
            builder.UseSqlServer(connection);
        }
    }
}
