import { Component, Injector, ChangeDetectionStrategy } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { PaginationParamsModel } from '@shared/commom/models/base.model';
import { GetPostForViewDto, ManagePostsServiceProxy } from '@shared/service-proxies/service-proxies';
import { ceil } from 'lodash-es';
import { Card } from 'primeng/card';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [ManagePostsServiceProxy]
})
export class HomeComponent extends AppComponentBase {

  filterText;
  sorting: string = "";
  paginationParams: PaginationParamsModel;
  post: GetPostForViewDto;
  isLoading = false;
  maxResultCount: number = 20;
  data: GetPostForViewDto[];
  visible: boolean = true;

  // Trong class HomeComponent
  searchValue: any;
  filteredData: GetPostForViewDto[] = [];

  constructor(injector: Injector, public _postService: ManagePostsServiceProxy) {
    super(injector);
  }

  ngOnInit() {
    this.paginationParams = { pageNum: 1, pageSize: 8, totalCount: 0 };
    this.getAll(this.paginationParams).subscribe((data) => {
      this.data = data.items;
      console.log(data);
      // Sau khi nhận được dữ liệu từ server, gọi hàm search() để áp dụng tìm kiếm
      this.search();
    });
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
      if (this.searchValue) {
        this.filteredData = this.data.filter(post => {
          const addressMatch = post.address.toLowerCase().includes(this.searchValue.toLowerCase());
          const roomPriceMatch = this.isRoomPriceCloseEnough(post.roomPrice, parseFloat(this.searchValue));
          return addressMatch || roomPriceMatch;
        });
      } else {
        this.filteredData = this.data;
      }
      this.paginationParams.totalCount = data.totalCount;
      this.paginationParams.totalPage = Math.ceil(data.totalCount / this.maxResultCount);
    });
  }

  // Xử lý tìm kiếm
  search() {
    this.filteredData = this.data.filter(post => {
      const addressMatch = !this.searchValue || post.address.toLowerCase().includes(this.searchValue.toLowerCase());
      const roomPriceMatch = !this.searchValue || this.isRoomPriceCloseEnough(post.roomPrice, parseFloat(this.searchValue));
      return addressMatch || roomPriceMatch;
    });
  }

  isRoomPriceCloseEnough(actualPrice: number, searchPrice: number): boolean {
    const threshold = 10;
    const difference = Math.abs(actualPrice - searchPrice);
    return difference <= threshold;
  }

  refresh() {
    // Đặt lại các biến dữ liệu về trạng thái ban đầu
    this.filterText = '';
    this.sorting = '';
    this.paginationParams = { pageNum: 1, pageSize: 8, totalCount: 0 };
    this.post = null;
    this.isLoading = true;
    this.maxResultCount = 20;
    this.data = [];
    this.visible = true;
    this.searchValue = null;
    this.filteredData = [];

    // Gọi lại hàm getAll để tải lại dữ liệu từ server
    this.getAll(this.paginationParams).subscribe((data) => {
      this.data = data.items;
      this.isLoading = false;
      this.search(); // Áp dụng lại tìm kiếm nếu có
      this.onPageChange({ page: this.paginationParams.pageNum - 1, rows: this.paginationParams.pageSize });
    });
  }

}
