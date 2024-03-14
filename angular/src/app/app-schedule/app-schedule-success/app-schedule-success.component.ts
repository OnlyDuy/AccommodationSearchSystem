import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { PaginationParamsModel } from '@shared/commom/models/base.model';
import { GetAllSchedulesDto, ManageAppointmentSchedulesServiceProxy } from '@shared/service-proxies/service-proxies';
import { ceil } from 'lodash-es';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-app-schedule-success',
  templateUrl: './app-schedule-success.component.html',
  styleUrls: ['./app-schedule-success.component.css'],
  providers : [ManageAppointmentSchedulesServiceProxy]
})
export class AppScheduleSuccessComponent extends AppComponentBase implements OnInit {

  isHost: boolean = false;

  filterText;
  sorting: string = "";
  paginationParams: PaginationParamsModel;
  selectedSchedule: GetAllSchedulesDto[];
  schedule: GetAllSchedulesDto;
  isLoading = false;
  maxResultCount: number = 20;
  rowData: GetAllSchedulesDto[];
  selectedRow: any;
  visible: boolean = true;
  shownLogin: number;

  constructor(
    injector: Injector,
    public _scheduleService: ManageAppointmentSchedulesServiceProxy
  ) {
      super(injector);
   }

  ngOnInit(): void {
    this.shownLogin = this.appSession.getShownLoginRoleId();
    if (this.shownLogin == 6 || this.shownLogin == 5) {
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
}
