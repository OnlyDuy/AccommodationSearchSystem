﻿using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using Abp.UI;
using AccommodationSearchSystem.AccommodationSearchSystem.ManagePosts.Dto;
using AccommodationSearchSystem.AccommodationSearchSystem.UserComment.Dto;
using AccommodationSearchSystem.Authorization.Users;
using AccommodationSearchSystem.Entity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.Design;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AccommodationSearchSystem.AccommodationSearchSystem.UserComment
{
    public class UserCommentAppService : ApplicationService, IUserCommentAppService
    {
        private readonly IRepository<AppointmentSchedule, long> _repositorySchedule;
        private readonly IRepository<UserComments, long> _repositoryComment;
        private readonly IRepository<User, long> _repositoryUser;
        private readonly IRepository<PhotoPost, long> _repositoryPhotoPost;
        private readonly IRepository<Post, long> _repositoryPost;

        public UserCommentAppService(
           IRepository<AppointmentSchedule, long> repositorySchedule,
           IRepository<Post, long> repositoryPost,
           IRepository<PhotoPost, long> repositoryPhotoPost,
           IRepository<UserComments, long> repositoryComment,
           IRepository<User, long> repositoryUser)

        {
            _repositorySchedule = repositorySchedule;
            _repositoryUser = repositoryUser;
            _repositoryPost = repositoryPost;
            _repositoryPhotoPost = repositoryPhotoPost;
            _repositoryComment = repositoryComment;
        }
        public async Task<UserCommentDto> AddComment(long postId, UserCommentDto input)
        {
            var userId = AbpSession.UserId;
            var tenanId = AbpSession.TenantId;
            input.PostId = postId;
            input.TenantId = tenanId;
            input.UserId = (long)userId;

            // Tiến hành lưu bình luận vào cơ sở dữ liệu
            var comment = ObjectMapper.Map<UserComments>(input);
            await _repositoryComment.InsertAsync(comment);
            await CurrentUnitOfWork.SaveChangesAsync();

            return input;
        }

        public async Task<UserCommentDto> Update(UserCommentDto input)
        {
            var userId = AbpSession.UserId;
            var tenanId = AbpSession.TenantId;
            var comment = await _repositoryComment.FirstOrDefaultAsync(c => c.Id == (long)input.Id && c.UserId == userId);
            if (comment == null)
            {
                throw new UserFriendlyException("Không tìm thấy bình luận để sửa");
            }

            comment.CommentContent = input.CommentContent; 

            // Tiến hành cập nhật thông tin bình luận vào cơ sở dữ liệu
            await _repositoryComment.UpdateAsync(comment);
            await CurrentUnitOfWork.SaveChangesAsync();

            return input;
        }

        public async Task DeleteComment(EntityDto<long> input)
        {
            var userId = AbpSession.UserId;
            var tenanId = AbpSession.TenantId;

            var data = await _repositoryComment.FirstOrDefaultAsync(c => c.UserId == userId && c.Id == input.Id && c.TenantId == tenanId);
            if (data != null)
            {
                await _repositoryComment.DeleteAsync(data);
            }
            else
            {
                throw new UserFriendlyException("Không tìm thấy bình luận để xóa");
            }
        }

        public async Task<List<UserCommentViewDto>> GetAllComment(long postId)
        {
            var tenanId = AbpSession.TenantId;
            var data = await (from c in _repositoryComment.GetAll()
                              join u in _repositoryUser.GetAll() on c.UserId equals u.Id
                              join p in _repositoryPost.GetAll() on c.PostId equals p.Id
                              where c.PostId == postId && c.TenantId == tenanId

                              orderby c.Id descending
                              select new UserCommentViewDto
                              {
                                  Id = c.Id,
                                  TenantId = c.TenantId,
                                  PostId = p.Id,
                                  UserId = u.Id,
                                  CommentContent = c.CommentContent,
                                  CreateByName = u.FullName,
                                  // Các trường thông tin người dùng khác cũng có thể được thêm vào nếu cần
                              }).ToListAsync();

            return data;
        }

        public async Task<UserCommentDto> GetCommentById(long id)
        {
            var comment = await _repositoryComment
                .FirstOrDefaultAsync(c => c.Id == id);

            return ObjectMapper.Map<UserCommentDto>(comment);
        }
    }
}