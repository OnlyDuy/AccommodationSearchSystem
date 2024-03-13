import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { CreateOrEditSchedulesDto, ManageAppointmentSchedulesServiceProxy, SessionServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AppScheduleWaitComponent } from '../app-schedule-wait.component';
import { finalize } from 'rxjs/operators';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'AppScheduleWaitUpdate',
  templateUrl: './app-schedule-wait-update.component.html',
  styleUrls: ['./app-schedule-wait-update.component.css'],
  providers : [ManageAppointmentSchedulesServiceProxy]
})
export class AppScheduleWaitUpdateComponent extends AppComponentBase implements OnInit {
  @ViewChild("editScheduleModal", { static: true }) modal: ModalDirective;
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

  checkSave: boolean = false;
  active: boolean = false;
  saving: boolean = false;
  schedules: CreateOrEditSchedulesDto = new CreateOrEditSchedulesDto();
  tenantId: number;
  scheduleWaitComponent: AppScheduleWaitComponent;
  minDate: Date;

  constructor(
    injector: Injector,
    public _scheduleService: ManageAppointmentSchedulesServiceProxy,
    public _scheduleWaitComponent: AppScheduleWaitComponent,
    private bsDatepickerConfig: BsDatepickerConfig,
    private _sessionService: SessionServiceProxy
  ) {
    super(injector);
    this.bsDatepickerConfig.dateInputFormat = 'DD/MM/YYYY';
    this.scheduleWaitComponent = _scheduleWaitComponent;
    this.minDate = new Date();
    this.minDate.getDate();
  }

  ngOnInit(): void {
    this._sessionService.getCurrentLoginInformations().subscribe((res) => {
      this.tenantId = res.tenant.id;
    });
  }

  show(ScheduleId?: number): void {
    this._scheduleService
        .getScheduleForEdit(ScheduleId)
        .subscribe((result) => {
          this.schedules = result.createOrEditSchedulesDtos;
          this.active = true
          this.modal.show();
        });
  }

  save(): void {
    this.saving = true;
    this.schedules.tenantId = this.tenantId;
    this._scheduleService
      .updateSchedule(this.schedules)
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe(() => {
        this.notify.info(this.l("SavedSuccessfully"));
        this.scheduleWaitComponent.updateTable();
        this.close();

        this.modalSave.emit();
        this.schedules = null;
        this.saving = false;
      });
  }

  close(): void {
    this.active = false;
    this.modal.hide();
  }



}
