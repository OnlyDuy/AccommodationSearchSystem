using Abp.Application.Services;
using Abp.Authorization;
using Abp.Domain.Repositories;
using AccommodationSearchSystem.AccommodationSearchSystem.ManagePosts;
using AccommodationSearchSystem.AccommodationSearchSystem.Statistical.Dto;
using AccommodationSearchSystem.Authorization;
using AccommodationSearchSystem.Authorization.Users;
using AccommodationSearchSystem.Entity;
using AccommodationSearchSystem.EntityFrameworkCore;
using AccommodationSearchSystem.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AccommodationSearchSystem.AccommodationSearchSystem.Statistical
{
    [AbpAuthorize(PermissionNames.Pages_Statistical)]
    public class StatisticalAppService : ApplicationService, IStatisticalAppService
    {
        private readonly IRepository<Post, long> _repositoryPost;
        private readonly IRepository<AppointmentSchedule, long> _repositorySchedule;
        private readonly IRepository<PhotoPost, long> _repositoryPhotoPost;
        private readonly IRepository<User, long> _repositoryUser;
        private readonly IRepository<PackagePost, long> _repositoryPackagePost;
        private readonly IRepository<UserLikePost, long> _repositoryUserLikePost;

        public StatisticalAppService(
           IRepository<Post, long> repositoryPost,
           IRepository<AppointmentSchedule, long> repositorySchedule,
           IRepository<PhotoPost, long> repositoryPhotoPost,
           IRepository<User, long> repositoryUser,
           IRepository<UserLikePost, long> repositoryUserLikePost,
           IRepository<PackagePost, long> repositoryPackagePost)

        {
            _repositoryPost = repositoryPost;
            _repositorySchedule = repositorySchedule;
            _repositoryUser = repositoryUser;
            _repositoryPhotoPost = repositoryPhotoPost;
            _repositoryPackagePost = repositoryPackagePost;
            _repositoryUserLikePost = repositoryUserLikePost;

        }

        public async Task<List<PostCategoryDto>> GetPostCountByCategory()
        {
            var tenantId = AbpSession.TenantId;
            var data = new List<PostCategoryDto>();

            // Lấy số lượng bài đăng theo từng loại
            var postCounts = await _repositoryPost.GetAll()
                .Where(p => p.TenantId == tenantId && !p.IsDeleted && p.ConfirmAdmin)
                .GroupBy(p => p.PriceCategory)
                .Select(g => new { PriceCategory = g.Key, Count = g.Count() })
                .ToListAsync();

            // Chuyển kết quả thành DTO
            data = postCounts.Select(pc => new PostCategoryDto
            {
                PriceCategory = pc.PriceCategory,
                Count = pc.Count
            }).ToList();

            return data;
        }

        public async Task<List<PostCountByMonthDto>> GetPostCountByMonth()
        {
            var tenantId = AbpSession.TenantId;
            var data = new List<PostCountByMonthDto>();

            // Lấy số lượng bài đăng theo tháng
            var postCounts = await _repositoryPost.GetAll()
                .Where(p => p.TenantId == tenantId && !p.IsDeleted && p.ConfirmAdmin)
                .GroupBy(p => new { p.CreationTime.Year, p.CreationTime.Month })
                .Select(g => new PostCountByMonthDto
                {
                    Year = g.Key.Year,
                    Month = g.Key.Month,
                    PostCount = g.Count()
                })
                .ToListAsync();

            // Tạo danh sách các tháng từ tháng 1 đến tháng 12
            var allMonths = Enumerable.Range(1, 12).Select(month => new { Year = DateTime.Now.Year, Month = month });

            data = allMonths.GroupJoin(postCounts,
                                       allMonth => new { allMonth.Year, allMonth.Month },
                                       postCount => new { postCount.Year, postCount.Month },
                                       (allMonth, postCount) => new PostCountByMonthDto
                                       {
                                           Year = allMonth.Year,
                                           Month = allMonth.Month,
                                           PostCount = postCount.Any() ? postCount.First().PostCount : 0
                                       })
                             .ToList();

            return data;
        }

        public async Task<List<ScheduleCountByMonthDto>> GetScheduleCountByMonth()
        {
            var successfulCounts = await GetSuccessfulScheduleCountByMonth();
            var cancelledByHostCounts = await GetCancelledByHostScheduleCountByMonth();
            var cancelledByTenantCounts = await GetCancelledByTenantScheduleCountByMonth();

            var data = new List<ScheduleCountByMonthDto>();

            // Combine data from three queries
            var result = successfulCounts
                .Concat(cancelledByHostCounts)
                .Concat(cancelledByTenantCounts)
                .GroupBy(s => new { s.Month, s.Year })
                .Select(g => new ScheduleCountByMonthDto
                {
                    Month = g.Key.Month,
                    Year = g.Key.Year,
                    SuccessfulCount = g.Sum(s => s.SuccessfulCount),
                    CancelledByHostCount = g.Sum(s => s.CancelledByHostCount),
                    CancelledByTenantCount = g.Sum(s => s.CancelledByTenantCount)
                })
                .ToList();

            // Tạo danh sách các tháng từ tháng 1 đến tháng 12
            var allMonths = Enumerable.Range(1, 12).Select(month => new { Year = DateTime.Now.Year, Month = month });

            data = allMonths.GroupJoin(result,
                                       allMonth => new { allMonth.Year, allMonth.Month },
                                       result => new { result.Year, result.Month },
                                       (allMonth, result) => new ScheduleCountByMonthDto
                                       {
                                           Year = allMonth.Year,
                                           Month = allMonth.Month,
                                           SuccessfulCount = result.Any() ? result.First().SuccessfulCount : 0,
                                           CancelledByHostCount = result.Any() ? result.First().CancelledByHostCount : 0,
                                           CancelledByTenantCount = result.Any() ? result.First().CancelledByTenantCount : 0,
                                       })
                             .ToList();

            return data;
        }

        private async Task<List<ScheduleCountByMonthDto>> GetSuccessfulScheduleCountByMonth()
        {
            return await _repositorySchedule.GetAll()
                .Where(s => s.Confirm && s.TenantId == AbpSession.TenantId)
                .GroupBy(s => new { Month = s.CreationTime.Month, Year = s.CreationTime.Year })
                .Select(g => new ScheduleCountByMonthDto
                {
                    Month = g.Key.Month,
                    Year = g.Key.Year,
                    SuccessfulCount = g.Count()
                })
                .ToListAsync();
        }

        private async Task<List<ScheduleCountByMonthDto>> GetCancelledByHostScheduleCountByMonth()
        {
            return await _repositorySchedule.GetAll()
                .Where(s => s.Cancel && s.CancelById == s.HostId && s.TenantId == AbpSession.TenantId)
                .GroupBy(s => new { Month = s.CreationTime.Month, Year = s.CreationTime.Year })
                .Select(g => new ScheduleCountByMonthDto
                {
                    Month = g.Key.Month,
                    Year = g.Key.Year,
                    CancelledByHostCount = g.Count()
                })
                .ToListAsync();
        }

        private async Task<List<ScheduleCountByMonthDto>> GetCancelledByTenantScheduleCountByMonth()
        {
            return await _repositorySchedule.GetAll()
                .Where(s => s.Cancel && s.CancelById != s.HostId && s.TenantId == AbpSession.TenantId)
                .GroupBy(s => new { Month = s.CreationTime.Month, Year = s.CreationTime.Year })
                .Select(g => new ScheduleCountByMonthDto
                {
                    Month = g.Key.Month,
                    Year = g.Key.Year,
                    CancelledByTenantCount = g.Count()
                })
                .ToListAsync();
        }


        public async Task<DashBoardTotalBooking> GetTotalBooking()
        {
            var tenantId = AbpSession.TenantId;
            var data = new DashBoardTotalBooking();

            data.TotalBooking = await (from s in _repositorySchedule.GetAll().AsNoTracking()
                                    where s.TenantId == tenantId && s.IsDeleted == false && s.Confirm == true
                                    select (int)s.Id).CountAsync();

            return data;
        }

        public async Task<DashBoardTotalPost> GetTotalPost()
        {
            var tenantId = AbpSession.TenantId;
            var data = new DashBoardTotalPost();

            data.TotalPost = await (from p in _repositoryPost.GetAll().AsNoTracking()
                                   where p.TenantId == tenantId && p.IsDeleted == false && p.ConfirmAdmin == true
                                   select (int)p.Id).CountAsync();

            return data;
        }

        public async Task<DashBoardTotalPost> GetTotalPostLike()
        {
            var tenantId = AbpSession.TenantId;
            var data = new DashBoardTotalPost();

            data.TotalPostLike = await (from ul in _repositoryUserLikePost.GetAll().AsNoTracking()
                                        where ul.TenantId == tenantId && ul.IsDeleted == false
                                        select (int)ul.Id).CountAsync();
            return data;
        }

        public async Task<DashBoardTotalUser> GetTotalUser()
        {
            var tenantId = AbpSession.TenantId;
            var data = new DashBoardTotalUser();

            data.TotalUser = await (from u in _repositoryUser.GetAll().AsNoTracking()
                                    where u.TenantId == tenantId && u.IsDeleted == false
                                    select (int)u.Id).CountAsync();

            return data;
        }

        public async Task<UserPostCountDto> GetUserWithMostPosts()
        {
            var tenantId = AbpSession.TenantId;

            var userWithMostPosts = await _repositoryPost.GetAll()
                .Where(p => p.TenantId == tenantId && p.ConfirmAdmin == true && p.IsDeleted == false)
                .GroupBy(p => p.CreatorUserId)
                .Select(g => new { UserId = g.Key, PostCount = g.Count() })
                .OrderByDescending(x => x.PostCount)
                .FirstOrDefaultAsync();

            if (userWithMostPosts == null)
            {
                return null;
            }

            var user = await _repositoryUser.GetAsync((int)userWithMostPosts.UserId);

            var data = new UserPostCountDto
            {
                UserId = user.Id,
                FullName = user.FullName,
                PostCount = userWithMostPosts.PostCount
            };

            return data;
        }

        public async Task<UserScheduleCountDto> GetUserWithMostSchedules()
        {
            var userWithMostSchedules = await _repositorySchedule.GetAll()
            .GroupBy(s => s.CreatorUserId)
            .Select(g => new { UserId = g.Key, ScheduleCount = g.Count() })
            .OrderByDescending(x => x.ScheduleCount)
            .FirstOrDefaultAsync();

            if (userWithMostSchedules == null)
            {
                return null;
            }

            var user = await _repositoryUser.GetAsync((int)userWithMostSchedules.UserId);

            var data = new UserScheduleCountDto
            {
                UserId = user.Id,
                FullName = user.FullName,
                ScheduleCount = userWithMostSchedules.ScheduleCount
            };

            return data;
        }
    }
}
