import { PaginationParamsModel } from './../../shared/commom/models/base.model';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { GetPostForViewDto, ManagePostsServiceProxy, ConfirmPostByAdminDto, CreateOrEditIPostDto } from '@shared/service-proxies/service-proxies';
import { ceil } from 'lodash-es';
import { Table } from 'primeng/table';
import { CreateOrEditPostComponent } from './create-or-edit-post/create-or-edit-post.component';
import { PostAdminViewComponent } from './post-admin-view/post-admin-view.component';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
  providers: [ManagePostsServiceProxy]
})
export class PostComponent extends AppComponentBase {
  // currentNameRole = abp.session.tenantId;
  // isHost: boolean = false;

  @ViewChild('CreateOrEditPost') CreateOrEditPost: CreateOrEditPostComponent;
  @ViewChild('PostAdminView') PostAdminView: PostAdminViewComponent;

  filterText;
  sorting: string = "";
  paginationParams: PaginationParamsModel;
  selectedPost: GetPostForViewDto[];
  post: GetPostForViewDto;
  isLoading = false;
  maxResultCount: number = 20;
  rowData: GetPostForViewDto[];
  rowDataConfirm: GetPostForViewDto[];
  selectedRow: any;
  visible: boolean = true;
  shownLogin: number;
  isAdmin: boolean = false;
  postConfirmAdmin: ConfirmPostByAdminDto = new ConfirmPostByAdminDto();
  postRepost: CreateOrEditIPostDto = new CreateOrEditIPostDto();
  statusPost: boolean = false;
  statusRepost: boolean = false;
  active: boolean = false;
  tenantId: number;

  constructor(
    injector: Injector,
    public _postService: ManagePostsServiceProxy
  ) {
    super(injector);
    // if (abp.session.tenantId == null) {
    //   this.isHost = true;
    // }
  }

  ngOnInit() {
    this.shownLogin = this.appSession.getShownLoginRoleId();
    if (this.shownLogin == 3) {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }
    this.getStatusConfirmAD();
    this.updateTable();
  }

  getStatusConfirmAD(): void {
    this._postService.statusConfirmAD(this.postConfirmAdmin).subscribe((
      res => {
        this.statusPost = res;
      }
    ))
  }

  getStatusRepostPost(): void {
    this._postService.statusRepostPost(this.postRepost).subscribe((
      res => {
        this.statusRepost = res;
      }
    ))
  }

  getAll(paginationParams: PaginationParamsModel) {
    return this._postService.getAllForHost(
      this.filterText,
      this.sorting ?? null,
      paginationParams ? paginationParams.skipCount : 0,
      paginationParams ? paginationParams.pageSize : 20,

    );
  }

  getAllForAdmin(paginationParams: PaginationParamsModel) {
    return this._postService.getAllForAdmin(
      this.filterText,
      this.sorting ?? null,
      paginationParams ? paginationParams.skipCount : 0,
      paginationParams ? paginationParams.pageSize : 20,

    );
  }

  createPost() {
    this.CreateOrEditPost.show();

  }
  editPost() {
    this.CreateOrEditPost.show(this.selectedRow.id);
  }

  repostPost() {
    this.getPostRepost(this.selectedRow.id);
    console.log(this.selectedRow);
  }

  getPostRepost(PostId?: number): void {

    this._postService
        .getLoyaltyGiftItemForEdit(PostId)
        .subscribe((result) => {
          this.postRepost = result.createOrEditPost;
          this.active = true;
          this.repost();
        });
  }

  repost() {
    this.getStatusRepostPost();
      this.message.confirm('', this.l('Bạn có thực sự muốn đăng lại bài viết này ?'), (isConfirme) => {
        if (isConfirme) {
          if (this.statusRepost) {
            this.notify.warn("Bài đăng chưa hết hạn");
          } else  {
          this.postRepost.tenantId = this.tenantId;
            this._postService.repostPost(this.postRepost)
              .subscribe(() => {
                this.notify.success(this.l('Đăng lại bài viết thành công'));
                this.updateTable();
              })
          }
        }
      })
  }


  deletePost() {
    this.message.confirm('', this.l('AreYouSureWantToDelete'), (isConfirme) => {
      if (isConfirme) {
        this._postService.deletePost(this.selectedRow.id)
          .subscribe(() => {
            this.notify.success(this.l('SuccessfullyDeleted'));
            this.updateTable();
          })
      }
    })
  }

  updateTable() {
    this.isLoading = true;
    this.rowData = [];
    this.paginationParams = { pageNum: 1, pageSize: 20, totalCount: 0 };
    this.getAll(this.paginationParams).subscribe(data => {
      this.rowData = data.items;
      this.paginationParams.totalPage = ceil(data.totalCount / this.maxResultCount);
      this.paginationParams.totalCount = data.totalCount;
      this.isLoading = false;
    });
    this.rowDataConfirm = [];
    this.getAllForAdmin(this.paginationParams).subscribe(data => {
      this.rowDataConfirm = data.items;
      this.paginationParams.totalPage = ceil(data.totalCount / this.maxResultCount);
      this.paginationParams.totalCount = data.totalCount;
      this.isLoading = false;
    });
  }

   // XÁC NHẬN LỊCH HẸN
   confirmPostAdmin() {
    this.getPostConfirm(this.selectedRow.id);
    console.log(this.selectedRow);
  }

  getPostConfirm(ScheduleId?: number): void {
    this._postService
        .getLoyaltyGiftItemForEdit(ScheduleId)
        .subscribe((result) => {
          this.postConfirmAdmin = result.confirmPostByAdmins;
          this.active = true;
          this.confirm();
        });
  }

  confirm(): void {
    this.getStatusConfirmAD();
    this.message.confirm('', 'Bạn có chắc chắn duyệt bài đăng này ?', (isConfirme) => {
      if (isConfirme) {
        if (this.statusPost) {
          this.notify.warn("Bài đăng đã được duyệt");
        } else  {
          this.postConfirmAdmin.tenantId = this.tenantId;
          this._postService.confirmPostAD(this.postConfirmAdmin)
            .subscribe(() => {
              this.notify.success('Duyệt bài đăng thành công');
              this.updateTable();
            })
        }

      }
    })
  }

  viewAdminPost() {
    this.PostAdminView.show(this.selectedRow.id);
  }

  getSeverity(status: boolean) {
    switch (status) {
        case true:
            return 'success';
        case false:
            return 'dangger';
    }
}
}

