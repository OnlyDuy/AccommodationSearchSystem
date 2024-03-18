import { Component, Injector, Input, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AppComponentBase } from "@shared/app-component-base";
import { Post } from "@shared/commom/models/post.model";
import {
  CreateOrEditIPostDto,
  FileParameter,
  GetPostForEditOutput,
  GetPostForViewDto,
  ManagePostsServiceProxy,
  PhotoDto,
  SessionServiceProxy,
} from "@shared/service-proxies/service-proxies";
import { environment } from "environments/environment";
import { FileItem, FileUploader } from "ng2-file-upload";
import {
  NgxGalleryAnimation,
  NgxGalleryImage,
  NgxGalleryOptions,
} from "@kolkov/ngx-gallery";

@Component({
  selector: "app-post-detail",
  templateUrl: "./post-detail.component.html",
  styleUrls: ["./post-detail.component.css"],
  providers: [ManagePostsServiceProxy],
})
export class PostDetailComponent extends AppComponentBase implements OnInit {
  postId: number;
  post: CreateOrEditIPostDto = new CreateOrEditIPostDto();
  postPhoto: PhotoDto;
  postPhotos: PhotoDto[] = [];

  postP: GetPostForViewDto;
  uploader!: FileUploader;
  hasBaseDropzoneOver = false;
  baseUrl = environment.apiUrl;
  @Input() posts!: Post;

  galleryOptions: NgxGalleryOptions[] = [];
  galleryImages: NgxGalleryImage[] = [];

  constructor(
    injector: Injector,
    public _postService: ManagePostsServiceProxy,
    private _sessionService: SessionServiceProxy,
    private route: ActivatedRoute
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.postId = +params["id"];
      this.getPostDetails(this.postId);
      // this.initializeUploader(this.postId);
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
        // thumbnailsSwipe: true, // Cho phép di chuyển giữa các ảnh nhỏ bằng swipe
        // previewKeyboardNavigation: true, // Điều hướng bằng bàn phím trong preview
        // previewZoom: true, // Cho phép zoom ảnh trong preview
        // previewZoomStep: 0.5, // Bước zoom khi sử dụng nút zoom
        // previewZoomMax: 3, // Giới hạn zoom tối đa
        // previewZoomMin: 0.5 // Giới hạn zoom tối thiểu
      },
    ];
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

  fileOverBase(e: any) {
    this.hasBaseDropzoneOver = e;
  }

  getPostDetails(postId: number): void {
    this._postService.getLoyaltyGiftItemForEdit(postId).subscribe((result) => {
      this.post = result.createOrEditPost;
      // this.postP.photos = result.photos;
      //Xử lý danh sách ảnh
      this.postPhotos = result.photos;
      // Tìm ảnh chính trong danh sách
      if (result.photos && result.photos.length > 0) {
        const mainPhoto = result.photos.find((photo) => photo.isMain);
        if (mainPhoto) {
          this.postPhoto = mainPhoto;
        } else {
          // Nếu không có ảnh chính, sử dụng ảnh đầu tiên trong danh sách
          this.postPhoto = result.photos[0];
        }
      }
      // Gọi hàm getImages() sau khi lấy được danh sách ảnh
      this.galleryImages = this.getImages();
    });
  }
}
