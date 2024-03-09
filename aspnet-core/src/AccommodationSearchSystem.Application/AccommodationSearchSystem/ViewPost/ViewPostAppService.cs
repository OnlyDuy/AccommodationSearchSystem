using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
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
        private readonly IPhotoService _photoService;
        private readonly AccommodationSearchSystemDbContext _context;

        public ViewPostAppService(
            IRepository<Post, long> repositoryPost,
            IRepository<Accommodate, long> repositoryAccommodate,
            IPhotoService photoService,
            IRepository<User, long> repositoryUser,
            AccommodationSearchSystemDbContext context,
            IRepository<Tenant, int> tenantRepo)

        {
            _repositoryPost = repositoryPost;
            _tenantRepo = tenantRepo;
            _repositoryUser = repositoryUser;
            _photoService = photoService;
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


        public async Task<GetPostForViewDto> GetForEdit(EntityDto<long> input)
        {
            var tenantId = AbpSession.TenantId;
            var query = from p in _repositoryPost.GetAll()
                        .Where(e => tenantId == e.TenantId)
                        orderby p.Id descending
                        join u in _repositoryUser.GetAll().AsNoTracking() on p.CreatorUserId equals u.Id
                        where u.TenantId == p.TenantId


                        select new GetPostForViewDto
                        {
                            Id = input.Id,
                            PostCode = p.PostCode,
                            Title = p.Title,
                            ContentPost = p.ContentPost,
                            Photo = p.Photo,
                            RoomPrice = p.RoomPrice,
                            Address = p.Address,
                            Area = p.Area,
                            Square = p.Square,
                            PriceCategory = p.PriceCategory,
                            Wifi = p.Wifi,
                            Parking = p.Parking,
                            Conditioner = p.Conditioner,
                            RoomStatus = p.RoomStatus,
                            TenantId = tenantId,
                            EmailAddress = u.EmailAddress,
                            PhoneNumber = u.PhoneNumber,
                        };
            return await query.FirstOrDefaultAsync();
        }

        public async Task<PagedResultDto<GetPostForViewDto>> GetAll(GetPostInputDto input)
        {
            var tenantId = AbpSession.TenantId;
            var query = from p in _repositoryPost.GetAll()
                        .Where(e => tenantId == e.TenantId)
                        .Where(e => input.filterText == null || e.Title.Contains(input.filterText))
                        orderby p.Id descending
                        join u in _repositoryUser.GetAll().AsNoTracking() on p.CreatorUserId equals u.Id 
                        where u.TenantId == p.TenantId

                        select new GetPostForViewDto
                        {
                            Id = p.Id,
                            PostCode = p.PostCode,
                            Title = p.Title,
                            ContentPost = p.ContentPost,
                            Photo = p.Photo,
                            RoomPrice = p.RoomPrice,
                            Address = p.Address,
                            Area = p.Area,
                            Square = p.Square,
                            PriceCategory = p.PriceCategory,
                            Wifi = p.Wifi,
                            Parking = p.Parking,
                            Conditioner = p.Conditioner,
                            RoomStatus = p.RoomStatus,
                            TenantId = tenantId,
                            EmailAddress = u.EmailAddress,
                            PhoneNumber = u.PhoneNumber,
                        };

            var totalCount = await query.CountAsync();
            var pagedAndFilteredPost = query.PageBy(input);
            return new PagedResultDto<GetPostForViewDto>(totalCount, await pagedAndFilteredPost.ToListAsync());
        }

        public Task<GetPostForEditOutput> GetLoyaltyGiftItemForEdit(EntityDto<long> input)
        {
            throw new NotImplementedException();
        }
    }
}
