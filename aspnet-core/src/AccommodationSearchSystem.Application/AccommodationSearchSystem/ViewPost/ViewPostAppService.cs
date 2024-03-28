using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using Abp.UI;
using AccommodationSearchSystem.AccommodationSearchSystem.ManagePosts;
using AccommodationSearchSystem.AccommodationSearchSystem.ManagePosts.Dto;
using AccommodationSearchSystem.Authorization;
using AccommodationSearchSystem.Authorization.Users;
using AccommodationSearchSystem.Entity;
using AccommodationSearchSystem.EntityFrameworkCore;
using AccommodationSearchSystem.Interfaces;
using AccommodationSearchSystem.MultiTenancy;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AccommodationSearchSystem.AccommodationSearchSystem.ViewPost
{
    [AbpAuthorize(PermissionNames.Pages_View_Posts)]
    public class ViewPostAppService : ApplicationService, IManagePostsAppService
    {
        private readonly IRepository<Post, long> _repositoryPost;
        private readonly IRepository<Tenant, int> _tenantRepo;
        private readonly IRepository<User, long> _repositoryUser;
        private readonly IRepository<AppointmentSchedule, long> _repositorySchedule;
        private readonly IPhotoService _photoService;
        private readonly IRepository<PhotoPost, long> _repositoryPhotoPost;
        private readonly IRepository<PackagePost, long> _repositoryPackagePost;
        private readonly AccommodationSearchSystemDbContext _context;

        public ViewPostAppService(
            IRepository<Post, long> repositoryPost,
            IRepository<Accommodate, long> repositoryAccommodate,
            IRepository<AppointmentSchedule, long> repositorySchedule,
            IRepository<PhotoPost, long> repositoryPhotoPost,
            IRepository<PackagePost, long> repositoryPackagePost,
            IPhotoService photoService,
            IRepository<User, long> repositoryUser,
            AccommodationSearchSystemDbContext context,
            IRepository<Tenant, int> tenantRepo)

        {
            _repositoryPost = repositoryPost;
            _tenantRepo = tenantRepo;
            _repositoryUser = repositoryUser;
            _repositorySchedule = repositorySchedule;
            _photoService = photoService;
            _repositoryPhotoPost = repositoryPhotoPost;
            _repositoryPackagePost = repositoryPackagePost;
            _context = context;

        }

        public Task CreateOrEdit(CreateOrEditIPostDto input)
        {
            throw new NotImplementedException();
        }

        public Task DeletePost(EntityDto<long> input)
        {
            throw new NotImplementedException();
        }

        // Lấy chi tiết bài đăng
        public async Task<GetPostForViewDto> GetForEdit(EntityDto<long> input)
        {
            var tenantId = AbpSession.TenantId;

            var query = from p in _repositoryPost.GetAll()
                        .Where(e => tenantId == e.TenantId && e.Id == input.Id)
                        orderby p.Id descending
                        join u in _repositoryUser.GetAll().AsNoTracking() on p.CreatorUserId equals u.Id
                        where u.TenantId == p.TenantId
                        select new
                        {
                            Post = p,
                            User = u
                        };

            var result = await query.FirstOrDefaultAsync();

            if (result == null)
            {
                throw new UserFriendlyException("Bài đăng không tồn tại hoặc bạn không có quyền truy cập.");
            }

            var post = result.Post;
            var user = result.User;

            var photoData = await _repositoryPhotoPost.GetAllListAsync(e => e.PostId == input.Id);

            var output = new GetPostForViewDto
            {
                Id = post.Id,
                PostCode = post.PostCode,
                Title = post.Title,
                ContentPost = post.ContentPost,
                Photo = post.Photo,
                RoomPrice = post.RoomPrice,
                Address = post.Address,
                District = post.District,
                City = post.City,
                Ward = post.Ward,
                Area = post.Area,
                Square = post.Square,
                PriceCategory = post.PriceCategory,
                Wifi = post.Wifi,
                Parking = post.Parking,
                Conditioner = post.Conditioner,
                RoomStatus = post.RoomStatus,
                TenantId = tenantId,
                EmailAddress = user.EmailAddress,
                PhoneNumber = user.PhoneNumber,
                Photos = photoData.Select(photo => new PhotoDto
                {
                    Url = photo.Url,
                    IsMain = photo.IsMain,
                    PostId = photo.PostId,
                    Id = photo.Id,
                }).ToList()
            };

            return output;
        }

        public async Task<PagedResultDto<GetPostForViewDto>> GetAll(GetPostInputDto input)
        {
            var tenantId = AbpSession.TenantId;
            var query = from p in _repositoryPost.GetAll()
            .Where(e => tenantId == e.TenantId && e.ConfirmAdmin == true)
            .Where(e => input.filterText == null || e.Title.Contains(input.filterText)
                                || e.Address.Contains(input.filterText) || e.RoomPrice.Equals(input.filterText))
                        join pk in _repositoryPackagePost.GetAll().AsNoTracking() on p.CreatorUserId equals pk.CreatorUserId into pkGroup
                        from pk in pkGroup.DefaultIfEmpty()
                        where pk == null || (pk.Cancel == false && pk.Confirm == true && pk.PackageType == "Gói VIP")
                        orderby pk.PackageType == null ? 0 : 1 descending, p.Id descending

                        //join s in _repositorySchedule.GetAll().AsNoTracking() on p.Id equals s.PostId into sGroup
                        //from s in sGroup.DefaultIfEmpty()
                        //where s == null || (s.TenantId == tenantId && (s.Confirm == null || s.Confirm == false))

                        select new { Post = p, PackagePost = pk, Photos = _repositoryPhotoPost.GetAll().AsNoTracking().Where(ph => ph.PostId == p.Id).ToList() };

            var totalCount = await query.CountAsync();
            var pagedAndFilteredPost = query.PageBy(input);

            var result = await pagedAndFilteredPost.ToListAsync();

            var postDtos = result.Select(item => new GetPostForViewDto
            {
                Id = item.Post.Id,
                PostCode = item.Post.PostCode,
                Title = item.Post.Title,
                ContentPost = item.Post.ContentPost,
                Photo = item.Post.Photo,
                RoomPrice = item.Post.RoomPrice,
                Address = item.Post.Address,
                District = item.Post.District,
                City = item.Post.City,
                Ward = item.Post.Ward,
                Area = item.Post.Area,
                Square = item.Post.Square,
                PriceCategory = item.Post.PriceCategory,
                Wifi = item.Post.Wifi,
                Parking = item.Post.Parking,
                Conditioner = item.Post.Conditioner,
                RoomStatus = item.Post.RoomStatus,
                PackageType = item.PackagePost != null ? item.PackagePost.PackageType : "Gói thường",
                TenantId = tenantId,
                Photos = item.Photos.Select(photo => new PhotoDto
                {
                    Id = photo.Id,
                    Url = photo.Url,
                    IsMain = photo.IsMain,
                    PostId = photo.PostId
                }).ToList(),
            }).ToList();

            return new PagedResultDto<GetPostForViewDto>(totalCount, postDtos);
        }

        public async Task<PagedResultDto<GetPostForViewDto>> GetAllForHostVIP(GetPostInputDto input)
        {
            var tenantId = AbpSession.TenantId;
            //var UserId = AbpSession.UserId;
            var query = from p in _repositoryPost.GetAll()
            .Where(e => tenantId == e.TenantId && e.ConfirmAdmin == true)
            .Where(e => input.filterText == null || e.Title.Contains(input.filterText)
                                || e.Address.Contains(input.filterText) || e.RoomPrice.Equals(input.filterText))
                        orderby p.Id descending

                        join pk in _repositoryPackagePost.GetAll().AsNoTracking() on p.CreatorUserId equals pk.CreatorUserId into pkGroup
                        from pk in pkGroup.DefaultIfEmpty()
                        where pk.Cancel == false && pk.Confirm == true && pk.PackageType == "Gói VIP pro"

                        select new { Post = p, PackagePost = pk, Photos = _repositoryPhotoPost.GetAll().AsNoTracking().Where(ph => ph.PostId == p.Id).ToList() };

            var totalCount = await query.CountAsync();
            var pagedAndFilteredPost = query.PageBy(input);

            var result = await pagedAndFilteredPost.ToListAsync();

            var postDtos = result.Select(item => new GetPostForViewDto
            {
                Id = item.Post.Id,
                PostCode = item.Post.PostCode,
                Title = item.Post.Title,
                ContentPost = item.Post.ContentPost,
                Photo = item.Post.Photo,
                RoomPrice = item.Post.RoomPrice,
                Address = item.Post.Address,
                District = item.Post.District,
                City = item.Post.City,
                Ward = item.Post.Ward,
                Area = item.Post.Area,
                Square = item.Post.Square,
                PriceCategory = item.Post.PriceCategory,
                Wifi = item.Post.Wifi,
                Parking = item.Post.Parking,
                Conditioner = item.Post.Conditioner,
                RoomStatus = item.Post.RoomStatus,
                TenantId = tenantId,
                PackageType = item.PackagePost != null ? item.PackagePost.PackageType : null,
                Photos = item.Photos.Select(photo => new PhotoDto
                {
                    Id = photo.Id,
                    Url = photo.Url,
                    IsMain = photo.IsMain,
                    PostId = photo.PostId
                }).ToList(),
            }).ToList();

            return new PagedResultDto<GetPostForViewDto>(totalCount, postDtos);
        }

        public async Task<bool> StatusRoom(long Id)
        {
            // Kiểm tra có RoomStatus == true
            var data = await _repositoryPost.FirstOrDefaultAsync(e => e.Id == Id && e.TenantId == AbpSession.TenantId && e.RoomStatus == true);
            if (data != null)
            {
                // Nếu có
                return true;
            }
            // Nếu không có
            else return false;
        }

        public Task<GetPostForEditOutput> GetLoyaltyGiftItemForEdit(EntityDto<long> input)
        {
            throw new NotImplementedException();
        }

        public Task<PagedResultDto<GetPostForViewDto>> GetAllForHost(GetPostInputDto input)
        {
            throw new NotImplementedException();
        }

        public Task<PagedResultDto<GetPostForViewDto>> GetAllForAdmin(GetPostInputDto input)
        {
            throw new NotImplementedException();
        }

        public Task ConfirmPostAD(ConfirmPostByAdminDto input)
        {
            throw new NotImplementedException();
        }
    }
}
