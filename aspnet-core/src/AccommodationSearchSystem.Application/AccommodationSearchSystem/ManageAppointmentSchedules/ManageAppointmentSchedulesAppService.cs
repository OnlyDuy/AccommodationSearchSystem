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
using AccommodationSearchSystem.Authorization;
using AccommodationSearchSystem.Authorization.Users;
using AccommodationSearchSystem.Entity;
using AccommodationSearchSystem.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace AccommodationSearchSystem.AccommodationSearchSystem.ManageAppointmentSchedules
{
    [AbpAuthorize(PermissionNames.Pages_Manage_Appointment_Schedules)]
    public class ManageAppointmentSchedulesAppService : ApplicationService, IManageAppointmentSchedulesAppService
    {
        private readonly IRepository<AppointmentSchedule, long> _repositorySchedule;
        private readonly IRepository<User, long> _repositoryUser;
        private readonly IRepository<Post, long> _repositoryPost;
        private readonly AccommodationSearchSystemDbContext _dbContext;
 
        public ManageAppointmentSchedulesAppService(
           IRepository<AppointmentSchedule, long> repositorySchedule,
           IRepository<Post, long> repositoryPost,
           IRepository<User, long> repositoryUser,
           AccommodationSearchSystemDbContext dbContext)

        {
            _repositorySchedule = repositorySchedule;
            _repositoryUser = repositoryUser;
            _repositoryPost = repositoryPost;
            _dbContext = dbContext;
        }

        public async Task ConfirmRateFinal(ConfirmSchedulesDto input)
        {
            var UserId = AbpSession.UserId;
            var dataCheck = await _repositorySchedule.FirstOrDefaultAsync(e => UserId == e.HostId && e.Confirm == true && e.Id == input.Id);
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
                }
            }
        }

        public async Task<PagedResultDto<GetAllSchedulesDto>> GetAll(GetSchedulesInputDto input)
        {
            var tenantId = AbpSession.TenantId;
            var UserId = AbpSession.UserId;
            var query = from s in _repositorySchedule.GetAll()
                        .Where(e => (tenantId == e.TenantId && UserId == e.CreatorUserId) || (tenantId == e.TenantId && UserId == e.HostId))
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
                            Confirm = s.Confirm
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
                                   where s.PostId == input.Id && s.TenantId == tenantId
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
            var dataschedule = await _repositorySchedule.FirstOrDefaultAsync(input.Id);

            var output = new GetScheduleForEditOutput
            {
                CreateOrEditSchedulesDtos = ObjectMapper.Map<CreateOrEditSchedulesDto>(dataschedule),
            };

            return output;
        }

        public async Task DeleteSchedule(EntityDto<long> input)
        {
            var scheduleId = (long)input.Id;
            var schedule = await _repositorySchedule.FirstOrDefaultAsync(e => e.Id == (long)input.Id);
            schedule.IsDeleted = true;

            await _repositoryPost.DeleteAsync(schedule.Id);
        }
    }
}
