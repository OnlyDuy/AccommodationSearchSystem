import { Component, Injector, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { Post } from '@shared/commom/models/post.model';
import { CreateOrEditIPostDto, FileParameter, GetPostForEditOutput, GetPostForViewDto, ManagePostsServiceProxy, SessionServiceProxy } from '@shared/service-proxies/service-proxies';
import { environment } from 'environments/environment';
import { FileItem, FileUploader } from 'ng2-file-upload';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css'],
  providers: [ManagePostsServiceProxy],
})
export class PostDetailComponent extends AppComponentBase implements OnInit {
  postId: number;
  post: CreateOrEditIPostDto = new CreateOrEditIPostDto();

  uploader!: FileUploader;
  hasBaseDropzoneOver = false;
  baseUrl = environment.apiUrl;
  @Input() posts!: Post;

  constructor(
    injector: Injector,
    public _postService: ManagePostsServiceProxy,
    private _sessionService: SessionServiceProxy,
    private route: ActivatedRoute
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.postId = +params['id'];
      this.getPostDetails(this.postId);
      this.initializeUploader(this.postId);
    });
  }

  fileOverBase(e: any) {
    this.hasBaseDropzoneOver = e;
  }

  getPostDetails(postId: number): void {
    this._postService.getLoyaltyGiftItemForEdit(postId).subscribe((result) => {
      this.post = result.createOrEditPost;
    });
  }

  initializeUploader(postId: number) {
    const urlWithPostId = `${this.baseUrl}api/services/app/ManagePosts/AddPhoto?Id=${postId}`;

    this.uploader = new FileUploader({
      // headers: [
      //   { name: 'Accept', value: 'application/json' },
      //   { name: 'Content-Type', value: 'application/json' }
      // ],
      url: urlWithPostId, // Sử dụng url với postId
      isHTML5: true,
      authToken: 'Bearer ' + abp.auth.getToken(),
      authTokenHeader: 'Authorization',
      // abp.auth.tokenCookieName = 'Abp.AuthToken';
      // abp.auth.tokenHeaderName = 'Authorization';
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });

    console.log(this.uploader);
    // Sau khi tải thêm tệp sẽ chuyển tệp dưới dạng tham số
    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    }

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const photo = JSON.parse(response);
        this.posts.photos.push(photo);
        if (photo.isMain) {
          this.posts.photoUrl = photo.url;
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
  }
