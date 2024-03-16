import { Post } from './../../../shared/commom/models/post.model';

import { Component, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { CreateOrEditIPostDto, ManagePostsServiceProxy, SessionServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { PostComponent } from '../post.component';
import { finalize } from 'rxjs/operators';
import { environment } from 'environments/environment';
import { FileItem, FileUploader, FileUploaderOptions } from 'ng2-file-upload';

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
    // this.initializeUploader();
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

  // initializeUploader(PostId?: number) {
  //   this.uploader = new FileUploader({
  //     headers: [
  //       { name: 'Accept', value: 'application/json' },
  //       { name: 'Content-Type', value: 'application/json' }
  //     ],
  //     url: this.baseUrl + 'api/services/app/ManagePosts/AddPhoto',
  //     isHTML5: true,
  //     authToken: 'Bearer ' + abp.auth.getToken(),
  //     allowedFileType: ['image'],
  //     removeAfterUpload: true,
  //     autoUpload: false,
  //     maxFileSize: 10 * 1024 * 1024
  //   });

  //   console.log(this.uploader);

  //   let uploadedFile: FileItem; // Tạo một biến để lưu trữ file

  //   this.uploader.onAfterAddingFile = (fileItem) => {
  //     fileItem.withCredentials = false;
  //     if (this.uploader.queue.length > 1) {
  //       const file = new File([fileItem._file], fileItem.file.name, { type: fileItem.file.type });
  //       this.uploader.addToQueue([file]);
  //     } else {
  //       fileItem.upload();
  //     }
  //   };

  //   this.uploader.onSuccessItem = (item, response, status, headers) => {
  //     if (response) {
  //       if (!uploadedFile) {
  //         console.error('No file uploaded');
  //         return;
  //       }

  //       this.posts = new CreateOrEditIPostDto();
  //       this.posts.id = PostId;

  //       // Gọi phương thức addPhoto của _postService với file và postId
  //       this._postService.addPhoto(PostId, JSON.parse(response)).subscribe(
  //         (photo) => {
  //           if (photo) {
  //             this.post.photos.push(photo);
  //             if (photo.isMain) {
  //               this.post.photoUrl = photo.url;
  //             }
  //           }
  //         },
  //         (error) => {
  //           console.error('Error adding photo: ', error);
  //         }
  //       );
  //     }
  //   };
  // }


  deletePhoto() {

  }

  setMainPhoto() {

  }

  fileOverBase(e: any) {
    this.hasBaseDropzoneOver = e;
  }
}

