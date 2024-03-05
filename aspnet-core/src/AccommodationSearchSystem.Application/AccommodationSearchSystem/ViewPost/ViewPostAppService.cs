using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using AccommodationSearchSystem.AccommodationSearchSystem.ManagePosts;
using AccommodationSearchSystem.AccommodationSearchSystem.ManagePosts.Dto;
using AccommodationSearchSystem.Authorization;
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
        private readonly IPhotoService _photoService;
        private readonly AccommodationSearchSystemDbContext _context;

        public ViewPostAppService(
            IRepository<Post, long> repositoryPost,
            IRepository<Accommodate, long> repositoryAccommodate,
            IPhotoService photoService,
            AccommodationSearchSystemDbContext context,
            IRepository<Tenant, int> tenantRepo)

        {
            _repositoryPost = repositoryPost;
            _tenantRepo = tenantRepo;
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

        public async Task<GetPostForEditOutput> GetLoyaltyGiftItemForEdit(EntityDto<long> input)
        {
            var datapost = await _repositoryPost.FirstOrDefaultAsync(input.Id);

            var output = new GetPostForEditOutput
            {
                CreateOrEditPost = ObjectMapper.Map<CreateOrEditIPostDto>(datapost),
            };

            return output;
        }

        public async Task<PagedResultDto<GetPostForViewDto>> GetAll(GetPostInputDto input)
        {
            var tenantId = AbpSession.TenantId;
            var query = from p in _repositoryPost.GetAll()
                        .Where(e => tenantId == e.TenantId)
                        .Where(e => input.filterText == null || e.Title.Contains(input.filterText))
                        orderby p.Id descending

                        //join acom in _repositoryAccommodate.GetAll()
                        //on p.Id equals acom.Id
                        //into results
                        //from result in results.DefaultIfEmpty()

                        //join dealername in _tenantRepo.GetAll()
                        //on p.TenantId equals dealername.Id
                        //into values
                        //from value in values.DefaultIfEmpty()

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
                            TenantId = tenantId
                        };

            var totalCount = await query.CountAsync();
            var pagedAndFilteredPost = query.PageBy(input);
            return new PagedResultDto<GetPostForViewDto>(totalCount, await pagedAndFilteredPost.ToListAsync());
        }
    }
}
