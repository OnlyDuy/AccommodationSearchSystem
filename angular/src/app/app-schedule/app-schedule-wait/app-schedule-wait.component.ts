import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { PaginationParamsModel } from '@shared/commom/models/base.model';
import { CancelSchedulesDto, ConfirmSchedulesDto, GetAllSchedulesDto, ManageAppointmentSchedulesServiceProxy } from '@shared/service-proxies/service-proxies';
import { ceil } from 'lodash-es';
import { Table } from 'primeng/table';
import { AppScheduleWaitUpdateComponent } from './app-schedule-wait-update/app-schedule-wait-update.component';
import { AppScheduleWaitViewPostComponent } from './app-schedule-wait-view-post/app-schedule-wait-view-post.component';
import { AppScheduleWaitCancelComponent } from './app-schedule-wait-cancel/app-schedule-wait-cancel.component';

@Component({
  selector: 'app-app-schedule-wait',
  templateUrl: './app-schedule-wait.component.html',
  styleUrls: ['./app-schedule-wait.component.css'],
  providers : [ManageAppointmentSchedulesServiceProxy]
})
export class AppScheduleWaitComponent extends AppComponentBase implements OnInit {
  @ViewChild('AppScheduleWaitUpdate') AppScheduleWaitUpdate: AppScheduleWaitUpdateComponent;
  @ViewChild('AppScheduleWaitView') AppScheduleWaitView: AppScheduleWaitViewPostComponent;
  @ViewChild('AppScheduleWaitCancel') AppScheduleWaitCancel: AppScheduleWaitCancelComponent;


  isHost: boolean = false;

  filterText;
  sorting: string = "";
  paginationParams: PaginationParamsModel;
  selectedSchedule: GetAllSchedulesDto[];
  schedule: GetAllSchedulesDto;
  schedulesConfirm: ConfirmSchedulesDto = new ConfirmSchedulesDto();
  schedulesCancel: CancelSchedulesDto = new CancelSchedulesDto();
  isLoading = false;
  maxResultCount: number = 20;
  rowData: GetAllSchedulesDto[];
  rowDataHost: GetAllSchedulesDto[];
  rowDataRenter: GetAllSchedulesDto[];
  selectedRow: any;
  visible: boolean = true;
  shownLogin: number;
  active: boolean = false;
  tenantId: number;

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
    this.rowDataHost = [];
    this.rowDataRenter = [];

    this.paginationParams = { pageNum: 1, pageSize: 20, totalCount: 0 };
    this.getAll(this.paginationParams).subscribe(data => {
      console.log(data.items);
      this.rowData = data.items;
      this.paginationParams.totalPage = ceil(data.totalCount / this.maxResultCount);
      this.paginationParams.totalCount = data.totalCount;
    });

    this.getAllCancelByHost(this.paginationParams).subscribe(data => {
      console.log(data.items);
      this.rowDataHost = data.items;
      this.paginationParams.totalPage = ceil(data.totalCount / this.maxResultCount);
      this.paginationParams.totalCount = data.totalCount;
    });

    this.getAllCancelByRenter(this.paginationParams).subscribe(data => {
      console.log(data.items);
      this.rowDataRenter = data.items;
      this.paginationParams.totalPage = ceil(data.totalCount / this.maxResultCount);
      this.paginationParams.totalCount = data.totalCount;
    });


  }

  getAll(paginationParams: PaginationParamsModel) {
    return this._scheduleService.getAll(
      this.filterText,
      this.sorting ?? null,
      paginationParams ? paginationParams.skipCount : 0,
      paginationParams ? paginationParams.pageSize : 20,

    );
  }

  getAllCancelByHost(paginationParams: PaginationParamsModel) {
    return this._scheduleService.getAllScheduleCancelByHost(
      this.filterText,
      this.sorting ?? null,
      paginationParams ? paginationParams.skipCount : 0,
      paginationParams ? paginationParams.pageSize : 20,

    );
  }

  getAllCancelByRenter(paginationParams: PaginationParamsModel) {
    return this._scheduleService.getAllScheduleCancelByRenter(
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

  editSchedule() {
    this.AppScheduleWaitUpdate.show(this.selectedRow.id);
    console.log(this.selectedRow);
  }

  viewSchedules() {
    this.AppScheduleWaitView.show(this.selectedRow.id);
    console.log(this.selectedRow);
  }

  deleteSchedule() {
    this.message.confirm('', this.l('AreYouSureToCancelYourAppointment'), (isConfirme) => {
      if (isConfirme) {
        this._scheduleService.deleteSchedule(this.selectedRow.id)
          .subscribe(() => {
            this.notify.success(this.l('SuccessfullyDeleted'));
            this.updateTable();
          })
      }
    })
  }

  // XÁC NHẬN LỊCH HẸN
  confirmSchedules() {
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
    this.message.confirm('', this.l('AreYouSureToConfirmYourAppointment'), (isConfirme) => {
      if (isConfirme) {
        this.schedulesConfirm.tenantId = this.tenantId;
        this._scheduleService.confirmSchedules(this.schedulesConfirm)
          .subscribe(() => {
            this.notify.success(this.l('SuccessfullyConfirm'));
            this.updateTable();
          })
      }
    })
  }

  // HỦY LỊCH HẸN KHÔNG LÝ DO
  cancelSchedule() {
    this.getScheduleCancel(this.selectedRow.id);
    console.log(this.selectedRow);
  }
  getScheduleCancel(ScheduleId?: number): void {
    this._scheduleService
        .getScheduleForEdit(ScheduleId)
        .subscribe((result) => {
          this.schedulesCancel = result.cancelSchedulesDtos;
          this.active = true;
          this.cancel();
        });
  }
  cancel(): void {
    this.message.confirm('', this.l('AreYouSureToCancelYourAppointment'), (isConfirme) => {
      if (isConfirme) {
        this.schedulesCancel.tenantId = this.tenantId;
        this._scheduleService.cancelSchedules(this.schedulesCancel)
          .subscribe(() => {
            this.notify.success(this.l('AppointmentHasBeenCancelled'));
            this.updateTable();
          })
      }
    })
  }

  // HỦY LỊCH HẸN CÓ LÝ DO
  cancelReasonSchedule() {
    this.AppScheduleWaitCancel.show(this.selectedRow.id);
    console.log(this.selectedRow);
  }

}
