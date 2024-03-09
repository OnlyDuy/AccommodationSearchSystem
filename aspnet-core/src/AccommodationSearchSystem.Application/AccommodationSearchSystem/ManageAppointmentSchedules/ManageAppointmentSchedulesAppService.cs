using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using Abp.UI;
using AccommodationSearchSystem.AccommodationSearchSystem.ManageAppointmentSchedules.Dto;
using AccommodationSearchSystem.AccommodationSearchSystem.ManagePosts.Dto;
using AccommodationSearchSystem.Authorization;
using AccommodationSearchSystem.Authorization.Users;
using AccommodationSearchSystem.Entity;
using Microsoft.EntityFrameworkCore;
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
        public ManageAppointmentSchedulesAppService(
           IRepository<AppointmentSchedule, long> repositorySchedule,
           IRepository<Post, long> repositoryPost,
           IRepository<User, long> repositoryUser)

        {
            _repositorySchedule = repositorySchedule;
            _repositoryUser = repositoryUser;
            _repositoryPost = repositoryPost;
        }

        public Task ConfirmRateFinal(ConfirmSchedulesDto input)
        {
            throw new NotImplementedException();
        }

        public async Task<PagedResultDto<GetAllSchedulesDto>> GetAll(GetSchedulesInputDto input)
        {
            var tenantId = AbpSession.TenantId;
            var query = from s in _repositorySchedule.GetAll()
                        .Where(e => tenantId == e.TenantId)
                        .Where(e => input.filterText == null || e.Confirm.Equals(input.filterText))
                        join p in _repositoryPost.GetAll() on s.PostId equals p.Id
                        join u in _repositoryUser.GetAll() on s.CreatorUserId equals u.Id
                        orderby s.Id descending

                        select new GetAllSchedulesDto
                        {
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
                                  Hour = DateTime.Now.TimeOfDay,
                                  // Các thuộc tính khác của schedule có thể được gán tại đây
                              }).FirstOrDefaultAsync();

            if (post == null)
            {
                // Xử lý khi không tìm thấy bài đăng tương ứng
                throw new UserFriendlyException(00, L("PostNotFound"));
            }


            // Khởi tạo đối tượng Schedule và chèn vào repository
            var schedulev1 = ObjectMapper.Map<AppointmentSchedule>(post);
            schedulev1.TenantId = tenantId;
            await _repositorySchedule.InsertAsync(schedulev1);

            //var query = await (from s in _repositorySchedule.GetAll()
            //                  join user in _repositoryUser.GetAll() on s.CreatorUserId equals user.Id
            //                  select new
            //                  {
            //                      user.FullName,
            //                      user.PhoneNumber
            //                      // Các thuộc tính khác của schedule có thể được gán tại đây
            //                  }).FirstOrDefaultAsync();

            //if (query != null)
            //{
            //    // Cập nhật các thuộc tính PhoneNumber và FullName của schedulev1
            //    schedulev1.RenterHostName = query.FullName;
            //    schedulev1.RenterHostPhoneNumber = query.PhoneNumber;
            //    var schedulev2 = ObjectMapper.Map<AppointmentSchedule>(query);
            //    // Lưu các thay đổi vào cơ sở dữ liệu (nếu cần)
            //    await _repositorySchedule.UpdateAsync(schedulev2);
            //}

            // Trả về thông tin về schedule đã được tạo
            return post;
        }


        public async Task EditSchedule(CreateOrEditSchedulesDto input)
        {
            var schedule = await _repositorySchedule.FirstOrDefaultAsync((long)input.Id);
            // Cập nhật các trường dữ liệu của bài đăng từ input
            ObjectMapper.Map(input, schedule);
        }
    }
}
