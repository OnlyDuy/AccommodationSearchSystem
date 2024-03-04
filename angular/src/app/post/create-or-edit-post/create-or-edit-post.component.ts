import { Post } from './../../../shared/commom/models/post.model';

import { Component, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { CreateOrEditIPostDto, ManagePostsServiceProxy, SessionServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { PostComponent } from '../post.component';
import { finalize } from 'rxjs/operators';
import { environment } from 'environments/environment';
import { FileUploader, FileUploaderOptions } from 'ng2-file-upload';

@Component({
  selector: 'CreateOrEditPost',
  templateUrl: './create-or-edit-post.component.html',
  styleUrls: ['./create-or-edit-post.component.css'],
  providers: [ManagePostsServiceProxy],
})
export class CreateOrEditPostComponent extends AppComponentBase {
  @ViewChild("createOrEditModal", { static: true }) modal: ModalDirective;
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
  @Input() post!: Post;

  checkSave: boolean = false;
  active: boolean = false;
  saving: boolean = false;
  posts: CreateOrEditIPostDto = new CreateOrEditIPostDto();
  tenantId: number;
  postComponent: PostComponent;

  uploader!: FileUploader;
  hasBaseDropzoneOver = false;
  baseUrl = environment.apiUrl;
  // baseUrl: any;

  constructor(
    injector: Injector,
    public _postService: ManagePostsServiceProxy,
    public _postComponent: PostComponent,
    private _sessionService: SessionServiceProxy
  ) {
    super(injector);
    this.postComponent = _postComponent;
  }


  ngOnInit() {
    this._sessionService.getCurrentLoginInformations().subscribe((res) => {
      this.tenantId = res.tenant.id;
    });
    this.initializeUploader();
  }

  show(PostId?: number): void {
    if (!PostId) {
      this.posts = new CreateOrEditIPostDto();
      this.posts.id = PostId;
      this.active = true;
      this.modal.show();

    } else {
      this._postService
        .getLoyaltyGiftItemForEdit(PostId)
        .subscribe((result) => {
          this.posts = result.createOrEditPost;
          this.active = true
          this.modal.show();
        });
    }
  }

  save(): void {
    this.saving = true;
    this.posts.tenantId = this.tenantId;
    this._postService
      .createOrEdit(this.posts)
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe(() => {
        this.notify.info(this.l("SavedSuccessfully"));
        this.postComponent.updateTable();
        this.close();

        this.modalSave.emit();
        this.posts = null;
        this.saving = false;
      });
  }

  close(): void {
    this.active = false;
    this.modal.hide();
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      headers: [
        { name: 'Accept', value: 'application/json' },
        { name: 'Content-Type', value: 'application/json' }
      ],
      url: this.baseUrl + 'api/services/app/ManagePosts/AddPhoto',
      isHTML5: true,
      authToken: 'Bearer ' + abp.auth.getToken(),
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });

    console.log(this.uploader);

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
      if (this.uploader.queue.length > 1) {
        this.uploader.addToQueue([file._file]);
      }
      // Thêm file vào hàng đợi để chuẩn bị gửi lên máy chủ
      // file.upload(); // Hoặc có thể sử dụng this.uploader.uploadAll() nếu muốn gửi tất cả các file trong hàng đợi
    };

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const photoDto: any = JSON.parse(response);

        const postDto: CreateOrEditIPostDto = {
          id: this.post.id,
          postCode: this.posts.postCode,
          tenantId: this.posts.tenantId,
          title: this.post.title,
          contentPost: this.post.contentPost,
          photo: '',
          roomPrice: this.post.roomPrice,
          address: this.post.address,
          area: this.post.area,
          square: this.post.square,
          roomStatus: this.posts.roomStatus,
          priceCategory: this.post.priceCategory,
          wifi: this.post.wifi,
          parking: this.post.parking,
          conditioner: this.post.conditioner,
          photos: [photoDto],
          init: function (_data?: any): void {
            throw new Error('Function not implemented.');
          },
          toJSON: function (data?: any) {
            throw new Error('Function not implemented.');
          },
          clone: function (): CreateOrEditIPostDto {
            throw new Error('Function not implemented.');
          }
        };

        this._postService.addPhoto(postDto)
          .subscribe((photo) => {
            if (photo) {
              this.post.photos.push(photo);
              if (photo.isMain) {
                this.post.photoUrl = photo.url;
              }
            }
          }, (error) => {
            console.error("Error adding photo: ", error);
          });
      }
    };
  }


  deletePhoto() {

  }

  setMainPhoto() {

  }

  fileOverBase(e: any) {
    this.hasBaseDropzoneOver = e;
  }
}

