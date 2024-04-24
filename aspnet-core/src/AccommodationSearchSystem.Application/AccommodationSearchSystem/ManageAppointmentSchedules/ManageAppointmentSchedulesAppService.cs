using Abp;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using Abp.Runtime.Session;
using Abp.UI;
using AccommodationSearchSystem.AccommodationSearchSystem.ManageAppointmentSchedules.Dto;
using AccommodationSearchSystem.AccommodationSearchSystem.ManagePosts.Dto;
using AccommodationSearchSystem.AccommodationSearchSystem.PackagePosts.Dto;
using AccommodationSearchSystem.Authorization;
using AccommodationSearchSystem.Authorization.Users;
using AccommodationSearchSystem.Entity;
using AccommodationSearchSystem.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AccommodationSearchSystem.AccommodationSearchSystem.ManageAppointmentSchedules
{
    [AbpAuthorize(PermissionNames.Pages_Manage_Appointment_Schedules)]
    public class ManageAppointmentSchedulesAppService : ApplicationService, IManageAppointmentSchedulesAppService
    {
        private readonly IRepository<AppointmentSchedule, long> _repositorySchedule;
        private readonly IRepository<User, long> _repositoryUser;
        private readonly IRepository<PhotoPost, long> _repositoryPhotoPost;
        private readonly IRepository<Post, long> _repositoryPost;
 
        public ManageAppointmentSchedulesAppService(
           IRepository<AppointmentSchedule, long> repositorySchedule,
           IRepository<Post, long> repositoryPost,
           IRepository<PhotoPost, long> repositoryPhotoPost,
           IRepository<User, long> repositoryUser)

        {
            _repositorySchedule = repositorySchedule;
            _repositoryUser = repositoryUser;
            _repositoryPost = repositoryPost;
            _repositoryPhotoPost = repositoryPhotoPost;
        }

        public async Task ConfirmSchedules(ConfirmSchedulesDto input)
        {
            var tenantId = AbpSession.TenantId;
            var UserId = AbpSession.UserId;
            var dataCheck = await _repositorySchedule.FirstOrDefaultAsync(e => UserId == e.HostId && e.Confirm == true 
                                    && e.Id == input.Id && tenantId == e.TenantId);
            if (dataCheck != null)
            {
                throw new UserFriendlyException(400, "Lịch hẹn đã được xác nhận");
            } else
            {
                //await _repositorySchedule.GetAll().Where(e => e.Id == input.Id).
                var schedule = await _repositorySchedule.FirstOrDefaultAsync(e => e.Id == input.Id && UserId == e.HostId);
                if (schedule != null)
                {
                    // Cập nhật thuộc tính của đối tượng schedule
                    schedule.Confirm = true;

                    // Lưu thay đổi vào cơ sở dữ liệu
                    await _repositorySchedule.UpdateAsync(schedule);
                    // Lấy thông tin từ _repositoryPost và cập nhật RoomStatus
                    var post = await (from s in _repositorySchedule.GetAll()
                                      join p in _repositoryPost.GetAll() on s.PostId equals p.Id
                                      where s.Id == input.Id
                                      select p).FirstOrDefaultAsync();

                    if (post != null)
                    {
                        post.RoomStatus = false;
                        await _repositoryPost.UpdateAsync(post);
                    }
                }
            }
        }

        public async Task CancelSchedules(CancelSchedulesDto input)
        {
            var UserId = AbpSession.UserId;
            var tenantId = AbpSession.TenantId;
            var dataCheck = await _repositorySchedule
                            .FirstOrDefaultAsync(e => (UserId == e.HostId && e.Cancel == true && e.Id == input.Id && tenantId == e.TenantId)
                                            || (UserId == e.CreatorUserId && e.Cancel == true && e.Id == input.Id && tenantId == e.TenantId));
            if (dataCheck != null)
            {
                throw new UserFriendlyException(400, "Lịch hẹn đã được hủy trước đó");
            }
            else
            {
                var schedule = await _repositorySchedule
                            .FirstOrDefaultAsync(e => (e.Id == input.Id && UserId == e.CreatorUserId)
                                                    || (e.Id == input.Id && UserId == e.HostId));
                if (schedule != null)
                {
                    // Cập nhật thuộc tính của đối tượng schedule
                    schedule.Cancel = true;
                    schedule.CancelById = (int)UserId;

                    // Lưu thay đổi vào cơ sở dữ liệu
                    await _repositorySchedule.UpdateAsync(schedule);
                }
            }
        }

        public async Task<PagedResultDto<GetAllSchedulesDto>> GetAll(GetSchedulesInputDto input)
        {
            var tenantId = AbpSession.TenantId;
            var UserId = AbpSession.UserId;
            var query = from s in _repositorySchedule.GetAll()
                        .Where(e => (tenantId == e.TenantId && UserId == e.CreatorUserId && e.Confirm == false && e.Cancel == false) 
                                    || (tenantId == e.TenantId && UserId == e.HostId && e.Confirm == false && e.Cancel == false))
                        .Where(e => input.filterText == null || e.Confirm.Equals(input.filterText))
                        join p in _repositoryPost.GetAll() on s.PostId equals p.Id
                        join u in _repositoryUser.GetAll() on s.CreatorUserId equals u.Id
                        orderby s.Id descending

                        select new GetAllSchedulesDto
                        {
                            Id = s.Id,
                            HostName = s.HostName,
                            HostPhoneNumber = s.HostPhoneNumber,
                            RenterHostName = u.FullName,
                            RenterHostPhoneNumber = u.PhoneNumber,
                            Day = s.Day,
                            Hour = s.Hour,
                            Confirm = s.Confirm,
                            Cancel = s.Cancel,
                        };

            var totalCount = await query.CountAsync();
            var pagedAndFilteredPost = query.PageBy(input);
            return new PagedResultDto<GetAllSchedulesDto>(totalCount, await pagedAndFilteredPost.ToListAsync());
        }

        public async Task<CreateOrEditSchedulesDto> CreateSchedule(EntityDto<long> input)
        {
            var tenantId = AbpSession.TenantId;
            // Lấy dữ liệu của post và user thông qua join
            var post = await (from p in _repositoryPost.GetAll()
                              join user in _repositoryUser.GetAll() on p.CreatorUserId equals user.Id
                              where p.Id == input.Id
                              select new CreateOrEditSchedulesDto
                              {
                                  PostId = (int)p.Id,
                                  HostId = (int)p.CreatorUserId,
                                  HostName = user.Name,
                                  HostPhoneNumber = user.PhoneNumber,
                                  Day = DateTime.Now.Date, // Gán ngày hiện tại
                                  GetPostForViewDtos = new GetPostForViewDto
                                  {
                                      Id = input.Id,
                                      Title = p.Title,
                                      RoomPrice = p.RoomPrice,
                                      PriceCategory = p.PriceCategory,
                                      Address = p.Address,
                                      Square = p.Square,
                                  },
                                  Hour = DateTime.Now,
                                  // Các thuộc tính khác của schedule có thể được gán tại đây
                              }).FirstOrDefaultAsync();
            var postCount = await (from s in _repositorySchedule.GetAll()
                                   join user in _repositoryUser.GetAll() on s.CreatorUserId equals user.Id
                                   where s.PostId == input.Id && s.TenantId == tenantId && s.Cancel == false
                                   select s).CountAsync();

            if (postCount >= 1)
            {
                throw new UserFriendlyException(00, "Bài đăng đã được lên lịch hoặc đã có người đặt ");
            }
            else
            {

                if (post == null)
                {
                    // Xử lý khi không tìm thấy bài đăng tương ứng
                    throw new UserFriendlyException(00, L("PostNotFound"));
                }


                // Khởi tạo đối tượng Schedule và chèn vào repository
                var schedulev1 = ObjectMapper.Map<AppointmentSchedule>(post);
                schedulev1.TenantId = tenantId;
                await _repositorySchedule.InsertAsync(schedulev1);
            }
            // Trả về thông tin về schedule đã được tạo
            return post;
        }

        public async Task<bool> StatusSchedule(EntityDto<long> input)
        {
            var tenantId = AbpSession.TenantId;
            var postCount = await (from s in _repositorySchedule.GetAll()
                                   join user in _repositoryUser.GetAll() on s.CreatorUserId equals user.Id
                                   where s.PostId == input.Id && s.TenantId == tenantId && s.Cancel == false
                                   select s).CountAsync();
            if (postCount >= 1)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public async Task EditSchedule(CreateOrEditSchedulesDto input)
        {
            var schedule = await _repositorySchedule.FirstOrDefaultAsync((long)input.Id);
            // Cập nhật các trường dữ liệu của bài đăng từ input
            ObjectMapper.Map(input, schedule);
        }

        public async Task UpdateSchedule(CreateOrEditSchedulesDto input)
        {
            var schedule = await _repositorySchedule.FirstOrDefaultAsync((long)input.Id);
            // Cập nhật các trường dữ liệu của bài đăng từ input
            ObjectMapper.Map(input, schedule);
        }

        public async Task<GetScheduleForEditOutput> GetScheduleForEdit(EntityDto<long> input)
        {
            var tenantId = AbpSession.TenantId;
            var dataschedule = await _repositorySchedule.FirstOrDefaultAsync(input.Id);
            var datascheduleConfirm = await _repositorySchedule.FirstOrDefaultAsync(input.Id);
            var datascheduleCancel = await _repositorySchedule.FirstOrDefaultAsync(input.Id);

            var datapostView = from s in _repositorySchedule.GetAll()
           .Where(e => tenantId == e.TenantId && e.Id == input.Id)
                               orderby s.Id descending
                               join p in _repositoryPost.GetAll().AsNoTracking() on s.PostId equals p.Id
                               join u in _repositoryUser.GetAll().AsNoTracking() on p.CreatorUserId equals u.Id
                               where u.TenantId == p.TenantId
                               select new
                               {
                                   Post = p,
                                   User = u
                               };
            var result = await datapostView.FirstOrDefaultAsync();

            if (result == null)
            {
                throw new UserFriendlyException("Bài đăng không tồn tại hoặc bạn không có quyền truy cập.");
            }

            var post = result.Post;
            var user = result.User;
            var photoData = await _repositoryPhotoPost.GetAllListAsync(e => e.PostId == post.Id);
            var output = new GetScheduleForEditOutput
            {
                CreateOrEditSchedulesDtos = ObjectMapper.Map<CreateOrEditSchedulesDto>(dataschedule),
                ConfirmSchedulesDtos = ObjectMapper.Map<ConfirmSchedulesDto>(datascheduleConfirm),
                CancelSchedulesDtos = ObjectMapper.Map<CancelSchedulesDto>(datascheduleCancel),
                Photos = new List<PhotoDto>(),
                Title = post.Title,
                ContentPost = post.ContentPost,
                RoomPrice = post.RoomPrice,
                Address = post.Address,
                District = post.District,
                City = post.City,
                Ward = post.Ward,
                Square = post.Square,
                PriceCategory = post.PriceCategory,
                Wifi = post.Wifi,
                Parking = post.Parking,
                Conditioner = post.Conditioner,
                RoomStatus = post.RoomStatus,
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

        public async Task DeleteSchedule(EntityDto<long> input)
        {
            var scheduleId = (long)input.Id;
            var schedule = await _repositorySchedule.FirstOrDefaultAsync(e => e.Id == (long)input.Id);
            schedule.IsDeleted = true;

            await _repositoryPost.DeleteAsync(schedule.Id);
        }

        public async Task<PagedResultDto<GetAllSchedulesDto>> GetAllScheduleSuccess(GetSchedulesInputDto input)
        {
            var tenantId = AbpSession.TenantId;
            var UserId = AbpSession.UserId;
            var query = from s in _repositorySchedule.GetAll()
                        .Where(e => (tenantId == e.TenantId && UserId == e.CreatorUserId && e.Confirm == true)
                            || (tenantId == e.TenantId && UserId == e.HostId && e.Confirm == true))
                        .Where(e => input.filterText == null || e.Confirm.Equals(input.filterText))
                        join p in _repositoryPost.GetAll() on s.PostId equals p.Id
                        join u in _repositoryUser.GetAll() on s.CreatorUserId equals u.Id
                        orderby s.Id descending

                        select new GetAllSchedulesDto
                        {
                            Id = s.Id,
                            HostName = s.HostName,
                            HostPhoneNumber = s.HostPhoneNumber,
                            RenterHostName = u.FullName,
                            RenterHostPhoneNumber = u.PhoneNumber,
                            Day = s.Day,
                            Hour = s.Hour,
                            Confirm = s.Confirm,
                            Cancel = s.Cancel,
                        };

            var totalCount = await query.CountAsync();
            var pagedAndFilteredPost = query.PageBy(input);
            return new PagedResultDto<GetAllSchedulesDto>(totalCount, await pagedAndFilteredPost.ToListAsync());
        }

        public async Task<PagedResultDto<GetAllSchedulesDto>> GetAllScheduleCancelByHost(GetSchedulesInputDto input)
        {
            var tenantId = AbpSession.TenantId;
            var UserId = AbpSession.UserId;
            var query = from s in _repositorySchedule.GetAll()
                        .Where(e => e.TenantId == tenantId && e.CancelById == e.HostId && e.Cancel == true)
                        .Where(e => input.filterText == null || e.Confirm.Equals(input.filterText))
                        join p in _repositoryPost.GetAll() on s.PostId equals p.Id
                        join u in _repositoryUser.GetAll() on s.CreatorUserId equals u.Id
                        orderby s.Id descending

                        select new GetAllSchedulesDto
                        {
                            Id = s.Id,
                            HostName = s.HostName,
                            HostPhoneNumber = s.HostPhoneNumber,
                            RenterHostName = u.FullName,
                            RenterHostPhoneNumber = u.PhoneNumber,
                            Day = s.Day,
                            Hour = s.Hour,
                            Confirm = s.Confirm,
                            Cancel = s.Cancel,
                        };

            var totalCount = await query.CountAsync();
            var pagedAndFilteredPost = query.PageBy(input);
            return new PagedResultDto<GetAllSchedulesDto>(totalCount, await pagedAndFilteredPost.ToListAsync());
        }

        public async Task<PagedResultDto<GetAllSchedulesDto>> GetAllScheduleCancelByRenter(GetSchedulesInputDto input)
        {
            var tenantId = AbpSession.TenantId;
            var UserId = AbpSession.UserId;
            var query = from s in _repositorySchedule.GetAll()
                        .Where(e => e.TenantId == tenantId && e.CancelById == e.CreatorUserId && e.Cancel == true)
                        .Where(e => input.filterText == null || e.Confirm.Equals(input.filterText))
                        join p in _repositoryPost.GetAll() on s.PostId equals p.Id
                        join u in _repositoryUser.GetAll() on s.CreatorUserId equals u.Id
                        orderby s.Id descending

                        select new GetAllSchedulesDto
                        {
                            Id = s.Id,
                            HostName = s.HostName,
                            HostPhoneNumber = s.HostPhoneNumber,
                            RenterHostName = u.FullName,
                            RenterHostPhoneNumber = u.PhoneNumber,
                            Day = s.Day,
                            Hour = s.Hour,
                            Confirm = s.Confirm,
                            Cancel = s.Cancel,
                        };

            var totalCount = await query.CountAsync();
            var pagedAndFilteredPost = query.PageBy(input);
            return new PagedResultDto<GetAllSchedulesDto>(totalCount, await pagedAndFilteredPost.ToListAsync());
        }
    }
}
