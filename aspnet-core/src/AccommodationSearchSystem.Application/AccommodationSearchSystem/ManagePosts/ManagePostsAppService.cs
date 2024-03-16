﻿using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using Abp.UI;
using AccommodationSearchSystem.AccommodationSearchSystem.ManagePosts.Dto;
using AccommodationSearchSystem.Authorization;
using AccommodationSearchSystem.Entity;
using AccommodationSearchSystem.EntityFrameworkCore;
using AccommodationSearchSystem.Interfaces;
using AccommodationSearchSystem.MultiTenancy;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AccommodationSearchSystem.AccommodationSearchSystem.ManagePosts
{
    [AbpAuthorize(PermissionNames.Pages_Posts)]
    public class ManagePostsAppService : ApplicationService, IManagePostsAppService
    {
        private readonly IRepository<Post, long> _repositoryPost;
        private readonly IRepository<AppointmentSchedule, long> _repositorySchedule;
        private readonly IRepository<PhotoPost, long> _repositoryPhotoPost;

        private readonly AccommodationSearchSystemDbContext _dbContext;
        private readonly IPhotoService _photoService;

        public ManagePostsAppService(
            IRepository<Post, long> repositoryPost,
            IRepository<AppointmentSchedule, long> repositorySchedule,
            IRepository<PhotoPost, long> repositoryPhotoPost,
            IPhotoService photoService,
            AccommodationSearchSystemDbContext dbContext)

        {
            _repositoryPost = repositoryPost;
            _repositorySchedule = repositorySchedule;
            _photoService = photoService;
            _dbContext = dbContext;
            _repositoryPhotoPost = repositoryPhotoPost;
 
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
            if (postCount >= 1)
            {
                throw new UserFriendlyException(00, L("ThisItemAlreadyExists"));
            } else
            {
                var post = ObjectMapper.Map<Post>(input);;
                post.TenantId = tenantId;
                await _repositoryPost.InsertAsync(post);
            }
        }

        protected virtual async Task Update(CreateOrEditIPostDto input)
        {
            var post = await _repositoryPost.FirstOrDefaultAsync((long)input.Id);
                // Cập nhật các trường dữ liệu của bài đăng từ input
                ObjectMapper.Map(input, post);
         
        }

        public async Task DeletePost(EntityDto<long> input)
        {
            var postId = (long)input.Id;
            var post = await _repositoryPost.FirstOrDefaultAsync(e => e.Id == (long)input.Id);
            post.IsDeleted = true;

            await _repositoryPost.DeleteAsync(post.Id);
        }

        public async Task<PagedResultDto<GetPostForViewDto>> GetAll(GetPostInputDto input)
        {
            var tenantId = AbpSession.TenantId;
            var query = from p in _repositoryPost.GetAll()
            .Where(e => tenantId == e.TenantId)
            .Where(e => input.filterText == null || e.Title.Contains(input.filterText)
                                || e.Address.Contains(input.filterText) || e.RoomPrice.Equals(input.filterText))
                        orderby p.Id descending

                        join s in _repositorySchedule.GetAll().AsNoTracking() on p.Id equals s.PostId into sGroup
                        from s in sGroup.DefaultIfEmpty()
                        where s == null || (s.TenantId == tenantId && (s.Confirm == null || s.Confirm == false))

                        select new { Post = p, Photos = _repositoryPhotoPost.GetAll().AsNoTracking().Where(ph => ph.PostId == p.Id).ToList() };

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
                Area = item.Post.Area,
                Square = item.Post.Square,
                PriceCategory = item.Post.PriceCategory,
                Wifi = item.Post.Wifi,
                Parking = item.Post.Parking,
                Conditioner = item.Post.Conditioner,
                RoomStatus = item.Post.RoomStatus,
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

        public async Task<GetPostForEditOutput> GetLoyaltyGiftItemForEdit(EntityDto<long> input)
        {
            var datapost = await _repositoryPost.FirstOrDefaultAsync(input.Id);
            var photoData = await _repositoryPhotoPost.GetAllListAsync(e => e.PostId == input.Id);
            var output = new GetPostForEditOutput
            {
                CreateOrEditPost = ObjectMapper.Map<CreateOrEditIPostDto>(datapost),
                // Khởi tạo danh sách hình ảnh
                Photos = new List<PhotoDto>()
            };
            // Nếu có thông tin về hình ảnh
            if (photoData != null)
            {
                output.Photos = photoData.Select(photo => new PhotoDto
                {
                    Url = photo.Url,
                    IsMain = photo.IsMain,
                    PostId = photo.PostId,
                    Id = photo.Id
                }).ToList();
            }

            return output;
        }

        public async Task<ActionResult<PhotoDto>> AddPhoto(long Id, IFormFile file)
        {
            var post = await _repositoryPost.FirstOrDefaultAsync(Id);
            var result = await _photoService.AddPhotoAsync(file);

            // Kiểm tra lỗi
            if (result.Error != null)
            {
                throw new UserFriendlyException(result.Error.Message);
            }

            // Khởi tạo danh sách nếu chưa được khởi tạo
            if (post.PhotoPosts == null)
            {
                post.PhotoPosts = new List<PhotoPost>();
            }

            var photo = new PhotoPost
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId,
                PostId = (int)post.Id
            };

            if (post.PhotoPosts.Count == 0)
            {
                photo.IsMain = true;
            }
            post.PhotoPosts.Add(photo);

            // Lưu cấc thay đổi
            return new CreatedAtRouteResult( new { id = post.Id }, ObjectMapper.Map<PhotoDto>(photo));
  
        }

        public Task<GetPostForViewDto> GetForEdit(EntityDto<long> input)
        {
            throw new System.NotImplementedException(); 
        }
    }
}
