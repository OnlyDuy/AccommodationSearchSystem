using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.AutoMapper;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using Abp.UI;
using AccommodationSearchSystem.AccommodationSearchSystem.ManagePosts.Dto;
using AccommodationSearchSystem.AccommodationSearchSystem.PackagePosts.Dto;
using AccommodationSearchSystem.Authorization;
using AccommodationSearchSystem.Authorization.Users;
using AccommodationSearchSystem.Entity;
using AccommodationSearchSystem.Services;
using AccommodationSearchSystem.VnPayment.Dto;
using IdentityModel.Client;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Primitives;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AccommodationSearchSystem.AccommodationSearchSystem.PackagePosts
{
    [AbpAuthorize(PermissionNames.Pages_Posting_Packages)]
    public class PackagePostsAppService : ApplicationService, IPackagePostsAppService
    {
        private readonly IRepository<User, long> _repositoryUser;
        private readonly IRepository<Post, long> _repositoryPost;
        private readonly IRepository<PackagePost, long> _repositoryPackagePost;
        private readonly IVnPayService _vnPayService;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public PackagePostsAppService(
           IRepository<Post, long> repositoryPost,
           IRepository<PackagePost, long> repositoryPackagePost,
           IVnPayService vnPayService,
           IRepository<User, long> repositoryUser,
           IHttpContextAccessor httpContextAccessor)

        {
            _repositoryUser = repositoryUser;
            _repositoryPost = repositoryPost;
            _repositoryPackagePost = repositoryPackagePost;
            _vnPayService = vnPayService;
            _httpContextAccessor = httpContextAccessor;

        }
        public async Task CancelPackage(CancelPostDto input)
        {
            var tenantId = AbpSession.TenantId;
            var UserId = AbpSession.UserId;
            var dataCheck = await _repositoryPackagePost.FirstOrDefaultAsync(e => tenantId == e.TenantId && e.Cancel == true
                                    && e.Id == input.Id);
            if (dataCheck != null)
            {
                throw new UserFriendlyException(400, "Gói đã được hủy");
            }
            else
            {
                var package = await _repositoryPackagePost.FirstOrDefaultAsync(e => e.Id == input.Id && tenantId == e.TenantId);
                if (package != null)
                {
                    package.Cancel = true;
                    // Lưu thay đổi vào cơ sở dữ liệu
                    await _repositoryPackagePost.UpdateAsync(package);
                }
            }
        }

        public async Task ConfirmPackage(ConfirmPackageDto input)
        {
            var tenantId = AbpSession.TenantId;
            var UserId = AbpSession.UserId;
            var dataCheck = await _repositoryPackagePost.FirstOrDefaultAsync(e => e.Confirm == true
                                    && e.Id == input.Id && tenantId == e.TenantId);
            if (dataCheck != null)
            {
                throw new UserFriendlyException(400, "Gói đã được xác nhận");
            }
            else
            {
                var package = await _repositoryPackagePost.FirstOrDefaultAsync(e => e.Id == input.Id && tenantId == e.TenantId);
                if (package != null)
                {
                    package.Confirm = true;

                    // Lưu thay đổi vào cơ sở dữ liệu
                    await _repositoryPackagePost.UpdateAsync(package);
                }
            }
        }

        public async Task<PackagePostDto> CreatePackage(PackagePostDto input)
        {
            var tenantId = AbpSession.TenantId;
            var hostId = AbpSession.UserId;

            var user = _repositoryUser.GetAll().Where(e => e.TenantId == tenantId && e.Id == hostId).FirstOrDefault();
            //// Kiểm tra xem bài đăng đã tồn tại hay chưa
            //var packageCount = _repositoryPackagePost.GetAll().Where(e => e.TenantId == tenantId && e.HostId == hostId && e.PackageType == input.PackageType).Count();
            //if (packageCount >= 1)
            //{
            //    throw new UserFriendlyException(00, "Bạn đã đăng ký gói này");
            //}
            //else
            //{

            // Tạo thanh toán VNPay
            var vnPayRequestModel = new VnPaymentRequestDto
            {
                OrderId = input.HostId,
                FullName = user.FullName,
                Description = input.Description,
                Amount = input.Amount,
                CreatedDate = DateTime.Now
            };
            // Lấy HttpContext từ IHttpContextAccessor
            var httpContext = _httpContextAccessor.HttpContext;
            input.PaymentUrl = _vnPayService.CreatePaymentUrl(httpContext, vnPayRequestModel);

            var formData = new Dictionary<string, StringValues>
            {
                { "vnp_TxnRef", new StringValues(input.HostId.ToString()) },
                { "vnp_TransactionNo", new StringValues(input.Amount.ToString()) },
            };

            var queryCollection = new QueryCollection(formData);

            var paymentResult = _vnPayService.PaymentExcute(queryCollection);
            if (paymentResult != null || paymentResult.VnPayResponseCode == "00")
            {

                var package = ObjectMapper.Map<PackagePost>(input);
                package.TenantId = tenantId;
                package.HostId = (int)hostId;
                package.Confirm = false;
                package.HostName = user.FullName;
                package.HostPhoneNumber = user.PhoneNumber;
                package.ExpirationDate = DateTime.Now.Date;
            
                await _repositoryPackagePost.InsertAsync(package);
                //}
                return new PackagePostDto { PaymentUrl = input.PaymentUrl };
            } else
            {
                
            }
            return new PackagePostDto { PaymentUrl = input.PaymentUrl };
        }

        public async Task<bool> StatusConfirm(ConfirmPackageDto input)
        {
            var tenantId = AbpSession.TenantId;
            var dataCheck = await _repositoryPackagePost.FirstOrDefaultAsync(e => e.Confirm == true
                                    && e.Id == input.Id && tenantId == e.TenantId);
            if (dataCheck != null)
            {
                return true;
            }
            return false;
        }

        public async Task<bool> StatusCreate()
        {
            var tenantId = AbpSession.TenantId;
            var hostId = AbpSession.UserId;
            var packageCount = _repositoryPackagePost.GetAll().Where(e => e.TenantId == tenantId && e.HostId == hostId && e.Cancel == false).Count();
            if (packageCount >= 1)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public async Task DeletePackage(EntityDto<long> input)
        {
            var packageId = (long)input.Id;
            var package = await _repositoryPackagePost.FirstOrDefaultAsync(e => e.Id == packageId);
            package.IsDeleted = true;

            await _repositoryPackagePost.DeleteAsync(package.Id);
        }

        public async Task<PagedResultDto<GetPackageViewDto>> GetAll(GetPackageInputDto input)
        {
            var tenantId = AbpSession.TenantId;
            var query = from p in _repositoryPackagePost.GetAll()
                        .Where(e => tenantId == e.TenantId && e.Cancel == false)
                        .Where(e => input.filterText == null || e.PackageType.Equals(input.filterText))
                        orderby p.Id descending

                        select new GetPackageViewDto
                        {
                            Id = p.Id,
                            HostId = p.HostId,
                            HostName = p.HostName,
                            HostPhoneNumber = p.HostPhoneNumber,
                            PackageType = p.PackageType,
                            PackageDetail = p.PackageDetail,
                            ExpirationDate = p.ExpirationDate,
                            Confirm = p.Confirm,
                            Cancel = p.Cancel
                        };

            var totalCount = await query.CountAsync();
            var pagedAndFilteredPost = query.PageBy(input);
            return new PagedResultDto<GetPackageViewDto>(totalCount, await pagedAndFilteredPost.ToListAsync());
        }

        public async Task<PagedResultDto<GetPackageViewDto>> GetAllForHost(GetPackageInputDto input)
        {
            var tenantId = AbpSession.TenantId;
            var hostId = AbpSession.UserId;
            var query = from p in _repositoryPackagePost.GetAll()
                        .Where(e => tenantId == e.TenantId && e.Cancel == false && e.CreatorUserId == hostId)
                        .Where(e => input.filterText == null || e.PackageType.Equals(input.filterText))
                        orderby p.Id descending

                        select new GetPackageViewDto
                        {
                            Id = p.Id,
                            HostId = p.HostId,
                            HostName = p.HostName,
                            HostPhoneNumber = p.HostPhoneNumber,
                            PackageType = p.PackageType,
                            PackageDetail = p.PackageDetail,
                            ExpirationDate = p.ExpirationDate,
                            Confirm = p.Confirm,
                            Cancel = p.Cancel
                        };

            var totalCount = await query.CountAsync();
            var pagedAndFilteredPost = query.PageBy(input);
            return new PagedResultDto<GetPackageViewDto>(totalCount, await pagedAndFilteredPost.ToListAsync());
        }

        public async Task<GetPackageForEditOutput> GetPackageForEdit(EntityDto<long> input)
        {
            var tenantId = AbpSession.TenantId;
            var dataPackage = await _repositoryPackagePost.FirstOrDefaultAsync(input.Id);
            var dataConfirmAdmin = await _repositoryPackagePost.FirstOrDefaultAsync(input.Id);
            var dataCancelAdmin = await _repositoryPackagePost.FirstOrDefaultAsync(input.Id);

            var output = new GetPackageForEditOutput
            {
                GetPackageViewDtos = ObjectMapper.Map<GetPackageViewDto>(dataPackage),
                ConfirmPackageDtos = ObjectMapper.Map<ConfirmPackageDto>(dataConfirmAdmin),
                CancelPostDtos = ObjectMapper.Map<CancelPostDto>(dataCancelAdmin),
            };
            return output;
        }

        public async Task EditPackage(GetPackageViewDto input)
        {
            var package = await _repositoryPackagePost.FirstOrDefaultAsync((long)input.Id);
            // Cập nhật các trường dữ liệu của bài đăng từ input
            ObjectMapper.Map(input, package);
        }
    }
}
