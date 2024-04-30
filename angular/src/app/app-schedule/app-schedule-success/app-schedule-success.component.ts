import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { PaginationParamsModel } from '@shared/commom/models/base.model';
import { ConfirmSchedulesDto, GetAllSchedulesDto, ManageAppointmentSchedulesServiceProxy } from '@shared/service-proxies/service-proxies';
import { ceil } from 'lodash-es';
import { Table } from 'primeng/table';
import { AppScheduleWaitViewPostComponent } from '../app-schedule-wait/app-schedule-wait-view-post/app-schedule-wait-view-post.component';

@Component({
  selector: 'app-app-schedule-success',
  templateUrl: './app-schedule-success.component.html',
  styleUrls: ['./app-schedule-success.component.css'],
  providers : [ManageAppointmentSchedulesServiceProxy]
})
export class AppScheduleSuccessComponent extends AppComponentBase implements OnInit {
  @ViewChild('AppScheduleWaitView') AppScheduleWaitView: AppScheduleWaitViewPostComponent;
  isHost: boolean = false;

  filterText;
  sorting: string = "";
  paginationParams: PaginationParamsModel;
  selectedSchedule: GetAllSchedulesDto[];
  schedulesConfirm: ConfirmSchedulesDto = new ConfirmSchedulesDto();
  schedule: GetAllSchedulesDto;
  isLoading = false;
  maxResultCount: number = 20;
  rowData: GetAllSchedulesDto[];
  selectedRow: any;
  visible: boolean = true;
  shownLogin: number;
  active: boolean = false;
  tenantId: number;
  rentalRepost: boolean = false;

  constructor(
    injector: Injector,
    public _scheduleService: ManageAppointmentSchedulesServiceProxy
  ) {
      super(injector);
   }

  ngOnInit(): void {
    this.shownLogin = this.appSession.getShownLoginRoleId();
    // if (this.shownLogin == 6 || this.shownLogin == 5) {
    //   this.isHost = true;
    // } else {
    //   this.isHost = false;
    // }
    if (this.shownLogin == 4 || this.shownLogin == 3) {
      this.isHost = true;
    } else {
      this.isHost = false;
    }
    this.rowData = [];
    this.paginationParams = { pageNum: 1, pageSize: 20, totalCount: 0 };
    this.getAll(this.paginationParams).subscribe(data => {
      console.log(data.items);
      this.rowData = data.items;
      this.paginationParams.totalPage = ceil(data.totalCount / this.maxResultCount);
      this.paginationParams.totalCount = data.totalCount;
    });

  }

  getRentalRepostPost(): void {
    this._scheduleService.statusRentalConfirm(this.schedulesConfirm).subscribe((
      res => {
        this.rentalRepost = res;
      }
    ))
  }

  getAll(paginationParams: PaginationParamsModel) {
    return this._scheduleService.getAllScheduleSuccess(
      this.filterText,
      this.sorting ?? null,
      paginationParams ? paginationParams.skipCount : 0,
      paginationParams ? paginationParams.pageSize : 20,

    );
  }

  clear(table: Table) {
    table.clear();
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
  }

  viewSchedules() {
    this.AppScheduleWaitView.show(this.selectedRow.id);
    console.log(this.selectedRow);
  }

  viewSchedules() {
    this.AppScheduleWaitView.show(this.selectedRow.id);
    console.log(this.selectedRow);
  }

  rentalConfirm() {
    this.getScheduleConfirm(this.selectedRow.id);
    console.log(this.selectedRow);
  }

  getScheduleConfirm(ScheduleId?: number): void {
    this._scheduleService
        .getScheduleForEdit(ScheduleId)
        .subscribe((result) => {
          this.schedulesConfirm = result.confirmSchedulesDtos;
          this.active = true;
          this.confirm();
        });
  }

  confirm(): void {
    this.getRentalRepostPost();
    this.message.confirm('', this.l('Bạn có chắc Người tìm trọ đã thuê phòng này ?'), (isConfirme) => {
      if (isConfirme) {
        if (this.rentalRepost) {
          this.notify.warn("Trạng thái thuê đã được thiết lập trước đó");
        } else  {
          this.schedulesConfirm.tenantId = this.tenantId;
          this._scheduleService.rentalConfirm(this.schedulesConfirm)
            .subscribe(() => {
              this.notify.success(this.l('Thiết lập trạng thái bài đăng'));
              this.updateTable();
            })
        }
      }
    })
  }
}
