import { Component, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { GetPostForViewDto, ManagePostsServiceProxy, PhotoDto, SessionServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';

@Component({
  selector: 'PostAdminView',
  templateUrl: './post-admin-view.component.html',
  styleUrls: ['./post-admin-view.component.css'],
  providers: [ManagePostsServiceProxy],
})
export class PostAdminViewComponent extends AppComponentBase implements OnInit{
  @ViewChild("postAdminViewModal", { static: true }) modal: ModalDirective;
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

  checkSave: boolean = false;
  active: boolean = false;
  post: GetPostForViewDto = new GetPostForViewDto();
  tenantId: number;
  postPhotos: PhotoDto[] = [];

  galleryOptions: NgxGalleryOptions[] = [];
  galleryImages: NgxGalleryImage[] = [];


  constructor(
    injector: Injector,
    public _postService: ManagePostsServiceProxy,
    private _sessionService: SessionServiceProxy
  ) {
    super(injector);
  }

  ngOnInit() {
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

  show(PostId?: number): void {
      this._postService
        .getForEdit(PostId)
        .subscribe((result) => {
          this.post = result;
          this.postPhotos = result.photos;
          this.galleryImages = this.getImages();

          this.active = true
          this.modal.show();
        });
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

  close(): void {
    this.active = false;
    this.modal.hide();
  }
}
