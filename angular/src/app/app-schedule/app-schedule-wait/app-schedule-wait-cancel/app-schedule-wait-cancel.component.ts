import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { CancelSchedulesDto, ManageAppointmentSchedulesServiceProxy, SessionServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AppScheduleWaitComponent } from '../app-schedule-wait.component';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'AppScheduleWaitCancel',
  templateUrl: './app-schedule-wait-cancel.component.html',
  styleUrls: ['./app-schedule-wait-cancel.component.css']
})
export class AppScheduleWaitCancelComponent extends AppComponentBase implements OnInit {

  @ViewChild("cancelScheduleModal", { static: true }) modal: ModalDirective;
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

  checkSave: boolean = false;
  active: boolean = false;
  saving: boolean = false;
  schedules: CancelSchedulesDto = new CancelSchedulesDto();
  tenantId: number;
  scheduleWaitComponent: AppScheduleWaitComponent;

  constructor(
    injector: Injector,
    public _scheduleService: ManageAppointmentSchedulesServiceProxy,
    public _scheduleWaitComponent: AppScheduleWaitComponent,
    private _sessionService: SessionServiceProxy
  ) {
      super(injector);
      this.scheduleWaitComponent = _scheduleWaitComponent;
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
          this.schedules = result.cancelSchedulesDtos;
          this.active = true
          this.modal.show();
        });
  }

  save(): void {
    this.saving = true;
    this.schedules.tenantId = this.tenantId;
    this.message.confirm('', this.l('AreYouSureToCancelYourAppointment'), (isConfirme) => {
      if (isConfirme) {
        this._scheduleService
          .cancelSchedules(this.schedules)
          .pipe(
            finalize(() => {
              this.saving = false;
            })
          )
          .subscribe(() => {
            this.notify.info(this.l("AppointmentHasBeenCancelled"));
            this.scheduleWaitComponent.updateTable();
            this.close();

            this.modalSave.emit();
            this.schedules = null;
            this.saving = false;
          });
      }
    })
  }

  close(): void {
    this.active = false;
    this.modal.hide();
  }
}
