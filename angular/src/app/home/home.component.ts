import { Component, Injector, ChangeDetectionStrategy } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { PaginationParamsModel } from '@shared/commom/models/base.model';
import { GetPostForViewDto, ManagePostsServiceProxy } from '@shared/service-proxies/service-proxies';
import { ceil } from 'lodash-es';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [ManagePostsServiceProxy]
})
export class HomeComponent extends AppComponentBase {

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

  constructor(injector: Injector, public _postService: ManagePostsServiceProxy) {
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
