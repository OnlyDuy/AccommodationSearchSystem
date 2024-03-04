using Abp.Application.Services;
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
        private readonly IRepository<Tenant, int> _tenantRepo;
        private readonly IPhotoService _photoService;
        private readonly AccommodationSearchSystemDbContext _context;

        public ManagePostsAppService(
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

        public async Task<GetPostForEditOutput> GetLoyaltyGiftItemForEdit(EntityDto<long> input)
        {
            var datapost = await _repositoryPost.FirstOrDefaultAsync(input.Id);

            var output = new GetPostForEditOutput
            {
                CreateOrEditPost = ObjectMapper.Map<CreateOrEditIPostDto>(datapost),
            };

            return output;
        }

        public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file, long Id)
        {
            // Nhận bài đăng theo postId
            var post = await _repositoryPost.FirstOrDefaultAsync(Id);

            // Kết quả là một dịch vụ ảnh
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
                // Url an toàn và tuyệt đối
                Url = result.SecureUrl.AbsoluteUri,
                // Id công khai
                PublicId = result.PublicId,
                PostId = (int)post.Id
            };

            // Kiểm tra liệu người dùng có bất kỳ bức ảnh nào vào lúc này hay không
            if (post.PhotoPosts.Count == 0)
            {
                // Nếu không có thì đây là bức ảnh đầu tiên được tải lên và nó là ảnh chính   
                photo.IsMain = true;
            }

            // Thêm hình ảnh
            post.PhotoPosts.Add(photo);

            // Lưu cấc thay đổi
            return new CreatedAtRouteResult("GetLoyaltyGiftItemForEdit", new { id = post.Id }, ObjectMapper.Map<PhotoDto>(photo));
            //throw new UserFriendlyException(00, L("ThisItemAlreadyExists"));
        }

    }
}
