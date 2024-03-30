import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { PaginationParamsModel } from '@shared/commom/models/base.model';
import { GetPostForLikeDto, GetPostForViewDto, PostLikeDto, ViewPostServiceProxy } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-post-view-like',
  templateUrl: './post-view-like.component.html',
  styleUrls: ['./post-view-like.component.css'],
  providers: [ViewPostServiceProxy],
})
export class PostViewLikeComponent extends AppComponentBase implements OnInit {

  filterText;
  sorting: string = "";
  paginationParams: PaginationParamsModel;
  paginationParamsVip: PaginationParamsModel;

  selectedPost: GetPostForLikeDto[];
  // post: GetPostForLikeDto;
  isLoading = false;
  maxResultCount: number = 20;
  dataLike: GetPostForLikeDto[];
  selectedRow: any;
  visible: boolean = true;

  constructor(injector: Injector, public _postService: ViewPostServiceProxy) {
    super(injector);
  }

  ngOnInit() {
    // this.paginationParams = { pageNum: 1, pageSize: 4, totalCount: 0 };
    // this.getAllLike(this.paginationParams).subscribe((data) => {
    //   this.dataLike = data.items;
    //   console.log(this.dataLike);
    // });
    this.updateTable();
    this.onPageChange({ page: this.paginationParams.pageNum - 1, rows: this.paginationParams.pageSize });
  }

  getAllLike(paginationParams: PaginationParamsModel) {
    return this._postService.getAllLike(
      this.filterText,
      this.sorting ?? null,
      (paginationParams.pageNum - 1) * paginationParams.pageSize, // Chuyển đổi số trang thành skipCount
      paginationParams.pageSize

    );
  }


  onPageChange(event: any) {
    this.paginationParams.pageNum = event.page + 1;
    this.paginationParams.pageSize = event.rows;
    this.getAllLike(this.paginationParams).subscribe((data) => {
      this.dataLike = data.items;
      this.paginationParams.totalCount = data.totalCount;
      this.paginationParams.totalPage = Math.ceil(data.totalCount / this.maxResultCount);
    });
  }

  hasMainPhoto(post: GetPostForLikeDto): boolean {
    return post.photos && post.photos.some(photo => photo.isMain == true);
  }

  getMainPhotoUrl(post: GetPostForLikeDto): string {
    const mainPhoto = post.photos.find(photo => photo.isMain);
    return mainPhoto ? mainPhoto.url
      : 'data:image/jpeg;base64,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';
  }

  deletePost(likeId: number) {
    // this.post.likeId == likeId;
    this.message.confirm('', 'Bạn muốn hủy yêu thích ?', (isConfirme) => {
      if (isConfirme) {
        this._postService.deletePostLike(likeId)
          .subscribe(() => {
            this.notify.success('Đã xóa yêu thích');
            this.updateTable();
          })
      }
    })
  }

  updateTable() {
    this.isLoading = true;
    this.dataLike = [];
    this.paginationParams = { pageNum: 1, pageSize: 4, totalCount: 0 };
    this.getAllLike(this.paginationParams).subscribe((data) => {
      this.dataLike = data.items;
      this.paginationParams.totalCount = data.totalCount;
      this.paginationParams.totalPage = Math.ceil(data.totalCount / this.maxResultCount);
      this.isLoading = false;
    });
  }
}
