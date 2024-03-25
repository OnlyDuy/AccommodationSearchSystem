import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { AppComponentBase } from '@shared/app-component-base';
import { CreateOrEditSchedulesDto, GetScheduleForEditOutput, ManageAppointmentSchedulesServiceProxy, PhotoDto, SessionServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'AppScheduleWaitView',
  templateUrl: './app-schedule-wait-view-post.component.html',
  styleUrls: ['./app-schedule-wait-view-post.component.css']
})
export class AppScheduleWaitViewPostComponent extends AppComponentBase implements OnInit {
  @ViewChild("editScheduleViewModal", { static: true }) modal: ModalDirective;
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

  active: boolean = false;
  saving: boolean = false;
  tenantId: number;
  schedules: CreateOrEditSchedulesDto = new CreateOrEditSchedulesDto();
  post: GetScheduleForEditOutput = new GetScheduleForEditOutput();
  postPhotos: PhotoDto[] = [];

  galleryOptions: NgxGalleryOptions[] = [];
  galleryImages: NgxGalleryImage[] = [];

  constructor(
    injector: Injector,
    public _scheduleService: ManageAppointmentSchedulesServiceProxy,
    private _sessionService: SessionServiceProxy
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this._sessionService.getCurrentLoginInformations().subscribe((res) => {
      this.tenantId = res.tenant.id;
    });

    this.galleryOptions = [
      {
        width: "500px",
        height: "500px",
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: true,
        previewCloseOnClick: true, // Đóng preview khi click vào ảnh
      },
    ];
  }

  show(ScheduleId?: number): void {
    this._scheduleService
        .getScheduleForEdit(ScheduleId)
        .subscribe((result) => {
          this.schedules = result.createOrEditSchedulesDtos;
          this.post = result;
          this.postPhotos = result.photos;
          this.galleryImages = this.getImages();
          this.active = true
          this.modal.show();
        });
  }

  close(): void {
    this.active = false;
    this.modal.hide();
  }

  getImages(): NgxGalleryImage[] {
    const imageUrls = [];
    for (const photo of this.postPhotos) {
      imageUrls.push({
        small: photo.url,
        medium: photo.url,
        big: photo.url,
      });
    }
    return imageUrls;
  }

}
