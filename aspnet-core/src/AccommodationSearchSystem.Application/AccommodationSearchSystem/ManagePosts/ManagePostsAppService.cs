using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using Abp.UI;
using AccommodationSearchSystem.AccommodationSearchSystem.ManagePosts.Dto;
using AccommodationSearchSystem.Authorization;
using AccommodationSearchSystem.Authorization.Users;
using AccommodationSearchSystem.Entity;
using AccommodationSearchSystem.MultiTenancy;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static AccommodationSearchSystem.Authorization.Roles.StaticRoleNames;

namespace AccommodationSearchSystem.AccommodationSearchSystem.ManagePosts
{
    [AbpAuthorize(PermissionNames.Pages_Posts)]
    public class ManagePostsAppService : ApplicationService, IManagePostsAppService
    {
        private readonly IRepository<Post, long> _repositoryPost;
        private readonly IRepository<Accommodate, long> _repositoryAccommodate;
        private readonly IRepository<Tenant, int> _tenantRepo;

        public ManagePostsAppService(
            IRepository<Post, long> repositoryPost, 
            IRepository<Accommodate, long> repositoryAccommodate,
            IRepository<Tenant, int> tenantRepo)

        {
            _repositoryPost = repositoryPost;
            _repositoryAccommodate = repositoryAccommodate;
            _tenantRepo = tenantRepo;

        }
        public async Task CreateOrEdit(CreateOrEditIPostDto input)
        {
            if (input.Id == null)
            {
                await Create(input);
            } 
            else
            {
                await Update(input);
            }
        }

        protected virtual async Task Create(CreateOrEditIPostDto input)
        {
            var tenantId = AbpSession.TenantId;
            // Kiểm tra xem bài đăng đã tồn tại hay chưa
            var postCount =  _repositoryPost.GetAll().Where(e => e.Id == input.Id && e.TenantId == tenantId).Count();
            var accommodateCount = _repositoryAccommodate.GetAll().Where(e => e.Id == input.Id && e.TenantId == tenantId).Count();
            if (postCount >= 1 && accommodateCount >= 1)
            {
                throw new UserFriendlyException(00, L("ThisItemAlreadyExists"));
            } else
            {
                var post = ObjectMapper.Map<Post>(input);
                var acommodate = ObjectMapper.Map<Accommodate>(input);


                post.AccommodateId = (int)acommodate.Id;
                post.TenantId = tenantId;
                await _repositoryPost.InsertAsync(post);

                acommodate.PostId = (int)post.Id;
                acommodate.TenantId = tenantId;
                await _repositoryAccommodate.InsertAsync(acommodate);
            }
        }

        protected virtual async Task Update(CreateOrEditIPostDto input)
        {
            var tenantId = AbpSession.TenantId;
            var postCount = _repositoryPost.GetAll().Where(e => e.Id != input.Id && e.TenantId == tenantId).Count();
            var accommodateCount = _repositoryAccommodate.GetAll().Where(e => e.Id != input.Id && e.TenantId == tenantId).Count();
            if (postCount >= 1 && accommodateCount >= 1)
            {
                throw new UserFriendlyException(00, L("ThisItemAlreadyExists"));
            }
            else
            {
                var postId = (long)input.Id;
                var post = await _repositoryPost.FirstOrDefaultAsync((long)input.Id);
                var accommodate = await _repositoryAccommodate.FirstOrDefaultAsync(a => a.PostId == postId);
                if (post == null && accommodate == null)
                {
                    throw new UserFriendlyException(00, L("PostAndAccommodateNotFound"));
                }
                else
                {
                    // Cập nhật các trường dữ liệu của bài đăng từ input
                    ObjectMapper.Map(input, post);

                    // Cập nhật các trường dữ liệu của Accommodate từ input
                    ObjectMapper.Map(input, accommodate);
                }
            }
         
        }

        public async Task Delete(EntityDto<long> input)
        {
            var postId = (long)input.Id;
            var post = await _repositoryPost.FirstOrDefaultAsync(e => e.Id == (long)input.Id);
            var accommodate = await _repositoryAccommodate.FirstOrDefaultAsync(a => a.Id == postId);
            if (post == null)
            {
                throw new UserFriendlyException(00, L("PostAndAccommodateNotFound"));
            }
            else
            {
                // Xóa thông tin bài đăng và Accommodate từ cơ sở dữ liệu
                await _repositoryPost.DeleteAsync(post.Id);
            }
             
            if (accommodate == null)
            {
                throw new UserFriendlyException(00, L("PostAndAccommodateNotFound"));
            } else
            {
                await _repositoryAccommodate.DeleteAsync(accommodate.Id);
            }
        }

        public async Task<PagedResultDto<GetPostForViewDto>> GetAll(GetPostInputDto input)
        {
            var tenantId = AbpSession.TenantId;
            var query = from p in _repositoryPost.GetAll()
                        .Where(e => tenantId == e.TenantId)
                        .Where(e => input.filterText == null || e.Title.Contains(input.filterText))

                        join acom in _repositoryAccommodate.GetAll()
                        on p.Id equals acom.Id
                        into results
                        from result in results.DefaultIfEmpty()

                        //join dealername in _tenantRepo.GetAll()
                        //on p.TenantId equals dealername.Id
                        //into values
                        //from value in values.DefaultIfEmpty()

                        select new GetPostForViewDto
                        {
                            Id = p.Id,
                            Title = p.Title,
                            ContentPost = p.ContentPost,
                            Photo = p.Photo,
                            RoomPrice = result.RoomPrice,
                            Address = result.Address,
                            Area = result.Area,
                            Square = result.Square,
                            PriceCategory = result.PriceCategory,
                            Wifi = result.Wifi,
                            Parking = result.Parking,
                            Conditioner = result.Conditioner,
                            RoomStatus = result.RoomStatus,
                            IsDeleted = result.IsDeleted,
                            TenantId = tenantId
                        };

            var totalCount = await query.CountAsync();
            var pagedAndFilteredPost = query.PageBy(input);
            return new PagedResultDto<GetPostForViewDto>(totalCount, await pagedAndFilteredPost.ToListAsync());
        }

        public async Task<GetPostForEditOutput> GetLoyaltyGiftItemForEdit(EntityDto<long> input)
        {
            var datapost = await _repositoryPost.FirstOrDefaultAsync(input.Id);
            var dataAccommodate = await _repositoryAccommodate.FirstOrDefaultAsync(input.Id);

            var output = new GetPostForEditOutput
            {
                CreateOrEditPost = ObjectMapper.Map<CreateOrEditIPostDto>(datapost),
                CreateOrEditAcom = ObjectMapper.Map<CreateOrEditIPostDto>(dataAccommodate),
                //CreateOrEditPost = new CreateOrEditIPostDto
                //{
                //    TenantId = datapost.TenantId,
                //    Id = datapost.Id,
                //    Title = datapost.Title,
                //    ContentPost = datapost.ContentPost,
                //    Photo = datapost.Photo,

                //},
                //CreateOrEditAcom = new CreateOrEditIPostDto
                //{
                //    RoomPrice = dataAccommodate.RoomPrice,
                //    Address = dataAccommodate.Address,
                //    Area = dataAccommodate.Area,
                //    Square = dataAccommodate.Square,
                //    RoomStatus = dataAccommodate.RoomStatus,
                //    PriceCategory = dataAccommodate.PriceCategory,
                //    Wifi = dataAccommodate.Wifi,
                //    Parking = dataAccommodate.Parking,
                //    Conditioner = dataAccommodate.Conditioner,
                //}

            };

            return output;
        }
    }
}
