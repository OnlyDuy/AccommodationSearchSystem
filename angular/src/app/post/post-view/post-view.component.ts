import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { PaginationParamsModel } from '@shared/commom/models/base.model';
import { GetPostForViewDto, ViewPostServiceProxy } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-post-view',
  templateUrl: './post-view.component.html',
  styleUrls: ['./post-view.component.css'],
  providers: [ViewPostServiceProxy]
})
export class PostViewComponent extends AppComponentBase {

  filterText;
  sorting: string = "";
  paginationParams: PaginationParamsModel;
  selectedPost: GetPostForViewDto[];
  post: GetPostForViewDto;
  isLoading = false;
  maxResultCount: number = 20;
  data: GetPostForViewDto[];
  selectedRow: any;
  visible: boolean = true;

  constructor(injector: Injector, public _postService: ViewPostServiceProxy) {
    super(injector);
  }

  ngOnInit() {
    this.paginationParams = { pageNum: 1, pageSize: 8, totalCount: 0 };
    this.onPageChange({ page: this.paginationParams.pageNum - 1, rows: this.paginationParams.pageSize });
  }

  getAll(paginationParams: PaginationParamsModel) {
    return this._postService.getAll(
      this.filterText,
      this.sorting ?? null,
      (paginationParams.pageNum - 1) * paginationParams.pageSize, // Chuyển đổi số trang thành skipCount
      paginationParams.pageSize

    );
  }

  onPageChange(event: any) {
    this.paginationParams.pageNum = event.page + 1;
    this.paginationParams.pageSize = event.rows;
    this.getAll(this.paginationParams).subscribe((data) => {
      this.data = data.items;
      this.paginationParams.totalCount = data.totalCount;
      this.paginationParams.totalPage = Math.ceil(data.totalCount / this.maxResultCount);
    });
  }

}
