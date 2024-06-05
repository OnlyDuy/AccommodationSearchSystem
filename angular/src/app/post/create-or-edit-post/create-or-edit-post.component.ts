import { PhotoDto } from './../../../shared/service-proxies/service-proxies';
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
  postPhotos: PhotoDto[] = [];

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
          this.postPhotos = result.photos;
          this.active = true
          this.modal.show();
        });
      this.initializeUploader(PostId);
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

  initializeUploader(postId: number) {
    const urlWithPostId = `${this.baseUrl}api/services/app/ManagePosts/AddPhoto?Id=${postId}`;

    this.uploader = new FileUploader({
      url: urlWithPostId, // Sử dụng url với postId
      isHTML5: true,
      authToken: 'Bearer ' + abp.auth.getToken(),
      authTokenHeader: 'Authorization',
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });

    console.log(this.uploader);
    // Sau khi tải thêm tệp sẽ chuyển tệp dưới dạng tham số
    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
      this.postComponent.updateTable();
    }

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const photo = JSON.parse(response);
        // this.posts.photos.push(photo);
        if (photo.isMain) {
          this.posts.photos = photo.url;
        }
      }
    }


    // this.uploader.onAfterAddingFile = (file) => {
    //   file.withCredentials = false;
    // }

    // this.uploader.onSuccessItem = (item, response, status, headers) => {
    //   if (response) {
    //     const photo = JSON.parse(response);
    //     // Gọi phương thức addPhoto của _postService với file và postId
    //     this._postService.addPhoto(postId, photo).subscribe(
    //         (result) => {
    //           this.posts.photos.push(result);
    //           if (result.isMain) {
    //             this.posts.photoUrl = result.url;
    //           }
    //         }
    //       );
    //     }
    //   };
    // }
  }

  setMainPhotos(postId: number, photoId: number) {
    this._postService.setMainPhoto(postId, photoId).subscribe(() => {
      // this.post.photoUrl = photo.url;
      this.posts.photos.forEach(p => {
        if (p.isMain) p.isMain = false;
        if (p.id === photoId) p.isMain = true;
      })
    })
  }

  deletePhoto(postId: number, photoId: number) {
    this._postService.deletePhoto(postId, photoId).subscribe(() => {
      this.posts.photos = this.posts.photos.filter(x => x.id === postId);
    })
  }

  fileOverBase(e: any) {
    this.hasBaseDropzoneOver = e;
  }
}

