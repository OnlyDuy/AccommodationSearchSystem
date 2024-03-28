import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { CancelPostDto, ConfirmPackageDto, GetPackageViewDto, PackagePostsServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppPackagePostsVipProComponent } from './app-package-posts-vip-pro/app-package-posts-vip-pro.component';
import { AppPackagePostsVipComponent } from './app-package-posts-vip/app-package-posts-vip.component';
import { PaginationParamsModel } from '@shared/commom/models/base.model';
import { ceil } from 'lodash-es';
import { Table } from 'primeng/table';
import { AppPackagePostsEditComponent } from './app-package-posts-edit/app-package-posts-edit.component';


@Component({
  selector: 'app-package-posts',
  templateUrl: './app-package-posts.component.html',
  styleUrls: ['./app-package-posts.component.css'],
  providers: [PackagePostsServiceProxy]
})
export class AppPackagePostsComponent extends AppComponentBase implements OnInit {


  @ViewChild('AppPackagePostsVipPro') AppPackagePostsVipPro: AppPackagePostsVipProComponent;
  @ViewChild('AppPackagePostsVip') AppPackagePostsVip: AppPackagePostsVipComponent;
  @ViewChild('AppPackagePostsEdit') AppPackagePostsEdit: AppPackagePostsEditComponent;

  isAdmin: boolean = false;
  shownLogin: number;
  rowDataPackage: GetPackageViewDto[];
  rowData: GetPackageViewDto[];
  filterText;
  sorting: string = "";
  paginationParams: PaginationParamsModel;
  pagination: PaginationParamsModel;
  selectedPackage:any;
  maxResultCount: number = 20;
  packageConfirm: ConfirmPackageDto = new ConfirmPackageDto();
  packageCancel: CancelPostDto = new CancelPostDto();
  tenantId: number;
  isLoading = false;
  active: boolean = false;

  constructor(
    injector: Injector,
    public _packageService: PackagePostsServiceProxy
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.shownLogin = this.appSession.getShownLoginRoleId();
    if (this.shownLogin == 3) {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }

    // this.rowDataPackage = [];
    // this.paginationParams = { pageNum: 1, pageSize: 20, totalCount: 0 };
    // this.getAll(this.paginationParams).subscribe(data => {
    //   console.log(data.items);
    //   this.rowDataPackage = data.items;
    //   this.paginationParams.totalPage = ceil(data.totalCount / this.maxResultCount);
    //   this.paginationParams.totalCount = data.totalCount;
    // });
    this.updateTable();
  }

  getAll(paginationParams: PaginationParamsModel) {
    return this._packageService.getAll(
      this.filterText,
      this.sorting ?? null,
      paginationParams ? paginationParams.skipCount : 0,
      paginationParams ? paginationParams.pageSize : 20,

    );
  }

  getAllForHost(paginationParams: PaginationParamsModel) {
    return this._packageService.getAllForHost(
      this.filterText,
      this.sorting ?? null,
      paginationParams ? paginationParams.skipCount : 0,
      paginationParams ? paginationParams.pageSize : 20,

    );
  }

  clear(table: Table) {
    table.clear();
  }

  createPackageVIPpro(): void {
    this.AppPackagePostsVipPro.show();
  }

  createPackageVIP(): void {
    this.AppPackagePostsVip.showVip();
  }

    // Xác nhận gói đăng ký
  confirmPackage() {
    this.getPackageConfirm(this.selectedPackage.id);
    console.log(this.selectedPackage);
  }

  getPackageConfirm(PackageId?: number): void {
    this._packageService
        .getPackageForEdit(PackageId)
        .subscribe((result) => {
          this.packageConfirm = result.confirmPackageDtos;
          this.active = true;
          this.confirm();
        });
  }

  confirm(): void {
    this.message.confirm('', 'Bạn có chắc sẽ xác nhận ?', (isConfirme) => {
      if (isConfirme) {
        this.packageConfirm.tenantId = this.tenantId;
        this._packageService.confirmPackage(this.packageConfirm)
          .subscribe(() => {
            this.notify.success('Gói này đã được lưu');
            this.updateTable();
          })
      }
    })
  }

  // Hủy gói đăng ký
  cancelPackage() {
    this.getPackageCancel(this.selectedPackage.id);
    console.log(this.selectedPackage);
  }

  getPackageCancel(PackageId?: number): void {
    this._packageService
        .getPackageForEdit(PackageId)
        .subscribe((result) => {
          this.packageCancel = result.cancelPostDtos;
          this.active = true;
          this.cancel();
        });
  }

  cancel(): void {
    this.message.confirm('', 'Bạn có chắc sẽ hủy ?', (isConfirme) => {
      if (isConfirme) {
        this.packageCancel.tenantId = this.tenantId;
        this._packageService.cancelPackage(this.packageCancel)
          .subscribe(() => {
            this.notify.success('Gói này đã được hủy');
            this.updateTable();
          })
      }
    })
  }

  updateTable() {
    this.isLoading = true;
    this.rowDataPackage = [];
    this.paginationParams = { pageNum: 1, pageSize: 20, totalCount: 0 };
    this.getAll(this.paginationParams).subscribe(data => {
      console.log(data.items);
      this.rowDataPackage = data.items;
      this.paginationParams.totalPage = ceil(data.totalCount / this.maxResultCount);
      this.paginationParams.totalCount = data.totalCount;
      this.isLoading = false;
    });
    this.rowData = [];
    this.pagination = { pageNum: 1, pageSize: 20, totalCount: 0 };
    this.getAllForHost(this.pagination).subscribe(data => {
      console.log(data.items);
      this.rowData = data.items;
      this.pagination.totalPage = ceil(data.totalCount / this.maxResultCount);
      this.pagination.totalCount = data.totalCount;
      this.isLoading = false;
    });
  }

  editPackage() {
    this.AppPackagePostsEdit.showPackage(this.selectedPackage.id);
    console.log(this.selectedPackage);
  }

  deletePackage() {
    this.message.confirm('', 'Bạn có thực sự muốn hủy gói này ?', (isConfirme) => {
      if (isConfirme) {
        this._packageService.deletePackage(this.selectedPackage.id)
          .subscribe(() => {
            this.notify.success('Gói đăng bài đã được hủy');
            this.updateTable();
          })
      }
    })
  }
}
