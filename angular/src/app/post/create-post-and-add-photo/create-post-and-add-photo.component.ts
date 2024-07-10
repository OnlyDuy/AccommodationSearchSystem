import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { Post } from '@shared/commom/models/post.model';
import { CreateOrEditIPostDto, FileParameter, ManagePostsServiceProxy, SessionServiceProxy } from '@shared/service-proxies/service-proxies';
import { environment } from 'environments/environment';
import { FileUploader } from 'ng2-file-upload';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { PostComponent } from '../post.component';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'CreatePostAndAddPhoto',
  templateUrl: './create-post-and-add-photo.component.html',
  styleUrls: ['./create-post-and-add-photo.component.css']
})
export class CreatePostAndAddPhotoComponent extends AppComponentBase implements OnInit {

  @ViewChild("createPostAndAddPhoto", { static: true }) modal: ModalDirective;
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
  @Input() post!: Post;

  active: boolean = false;
  saving: boolean = false;
  postAdds: CreateOrEditIPostDto = new CreateOrEditIPostDto();
  tenantId: number;
  uploaderPost: FileUploader;
  baseUrl = environment.apiUrl;
  private postId: number;

  constructor(
    injector: Injector,
    private _postService: ManagePostsServiceProxy,
    private _sessionService: SessionServiceProxy,
    private http: HttpClient,
    public _postComponent: PostComponent,
  ) {
    super(injector);
    this.uploaderPost = new FileUploader({
      url: `${this.baseUrl}api/services/app/ManagePosts/AddPhoto`,
      isHTML5: true,
      authToken: "Bearer " + abp.auth.getToken(),
      authTokenHeader: "Authorization",
      allowedFileType: ["image"],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024,
    });

    this.uploaderPost.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };

    this.uploaderPost.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const photo = JSON.parse(response);
        if (photo.isMain) {
          this.postAdds.photos = photo.url;
        }
      }
    };

  }

  ngOnInit() {
    this._sessionService.getCurrentLoginInformations().subscribe((res) => {
      this.tenantId = res.tenant.id;
    });
  }

  show(): void {
    this.postAdds = new CreateOrEditIPostDto();
    this.active = true;
    this.modal.show();
  }

  save(): void {
    this.saving = true;
    this.postAdds.tenantId = this.tenantId;
    this._postService
      .createOrEdit(this.postAdds)
      .pipe(finalize(() => {
        this.saving = false;
      }))
      .subscribe((result) => {
        this.postId = result;
        this.notify.info(this.l("SavedSuccessfully"));
        this.uploadImages();
        this._postComponent.updateTable();
        this.close();

        this.modalSave.emit();
        this.postAdds = null;
        this.saving = false;

      });
  }

  uploadImages(): void {
    const filesToUpload: FileParameter[] = this.uploaderPost.queue.map(fileItem => {
      const fileParameter: FileParameter = {
        data: fileItem._file,
        fileName: fileItem.file.name
      };
      return fileParameter;
    });


    this._postService.createAndAddPhoto(this.postId, filesToUpload)
      .subscribe(() => {
        this.notify.success(this.l("Thêm ảnh thành công"));

        this.uploaderPost.cancelAll();
      }, (error) => {
        this.notify.error(this.l("Thêm ảnh thất bại"));
      });
  }

  close(): void {
    this.active = false;
    this.modal.hide();
  }

}
