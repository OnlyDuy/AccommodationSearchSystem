import { Component, Injector, Input, OnInit, ViewChild } from "@angular/core";
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
  UserCommentDto,
  UserCommentServiceProxy,
  UserCommentViewDto,
} from "@shared/service-proxies/service-proxies";
import { environment } from "environments/environment";
import { FileItem, FileUploader } from "ng2-file-upload";
import {
  NgxGalleryAnimation,
  NgxGalleryImage,
  NgxGalleryOptions,
} from "@kolkov/ngx-gallery";
import { AgmMap, MapsAPILoader } from "@agm/core";
import { CommentsService } from "@app/_services/comments.service";
import * as moment from "moment";
import { finalize } from "rxjs/operators";

@Component({
  selector: "app-post-detail",
  templateUrl: "./post-detail.component.html",
  styleUrls: ["./post-detail.component.css"],
  providers: [ManagePostsServiceProxy, UserCommentServiceProxy],
})
export class PostDetailComponent extends AppComponentBase implements OnInit {

  shownLogin: number;
  isHost: boolean = false;
  hostId: number;

  postId: number;
  post: CreateOrEditIPostDto = new CreateOrEditIPostDto();
  postUser: GetPostForEditOutput = new GetPostForEditOutput();
  postPhoto: PhotoDto;
  postPhotos: PhotoDto[] = [];

  postP: GetPostForViewDto;
  uploader!: FileUploader;
  hasBaseDropzoneOver = false;
  baseUrl = environment.apiUrl;
  @Input() posts!: Post;

  galleryOptions: NgxGalleryOptions[] = [];
  galleryImages: NgxGalleryImage[] = [];

  directionsActive: boolean = false;

  // Biến lưu vị trí bài đăng
  postLat: number;
  postLng: number;
  // Biến lưu vị trí hiện tại
  lat: number;
  lng: number;
  zoom = 15;
  locationChosen = false;
  locationName: string;
  locationNamePost: string;
  map: google.maps.Map;
  @ViewChild(AgmMap, { static: true }) agmMap: AgmMap;

  directionsService: any;
  directionsRenderer: any;

  userComment: UserCommentDto = new UserCommentDto();
  comment: string;
  commentsView: UserCommentViewDto[] = [];
  comments: UserCommentDto[] = [];
  editMode: boolean = false;
  commentIdToUpdate: number;
  totalCmt: number;

  constructor(
    injector: Injector,
    public _postService: ManagePostsServiceProxy,
    private _sessionService: SessionServiceProxy,
    public _userCommentService: UserCommentServiceProxy,
    private _commentsService: CommentsService,
    private route: ActivatedRoute,
    private _mapsAPILoader: MapsAPILoader
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.shownLogin = this.appSession.getShownLoginRoleId();
    if (this.shownLogin == 4 || this.shownLogin == 3) {
      this.isHost = true;
      this.hostId = abp.session.userId;
    } else {
      this.isHost = false;
    }
    console.log(this.isHost);
    console.log(this.hostId);

    this.route.params.subscribe((params) => {
      this.postId = +params["id"];
      this.getPostDetails(this.postId);
      // this.initializeUploader(this.postId);
    });

    this.galleryOptions = [
      {
        width: "600px",
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
    this.getCurrentLocation();
    this.getComments();
    this.getTotalComments();
    // Kết nối tới SignalR Hub
    this._commentsService.startConnection();

    this._commentsService.updateComment.subscribe((updatedComment: UserCommentDto) => {
      var index = this.comments.findIndex(comment => comment.id === updatedComment.id);
      if (index !== -1) {
        this.comments[index] = updatedComment;
      }
    });

    this._commentsService.deleteComment.subscribe((deletedCommentId: number) => {
      var index = this.comments.findIndex(comment => comment.id === deletedCommentId);
      if (index !== -1) {
        this.comments.splice(index, 1);
      }
    });

    this._commentsService.allCommentsReceived.subscribe((cmt: UserCommentViewDto[]) => {
      cmt.forEach(comment => {
        // Chuyển đổi creationTime thành đối tượng moment
        const creationTimeMoment = moment(comment.creationTime);

        const timeDiff = Math.abs(new Date().getTime() - creationTimeMoment.toDate().getTime());
        comment.timeAgo = this.calculateTimeAgo(timeDiff);
      });
      this.commentsView = cmt;
    });


    this._commentsService.commentReceived.subscribe((cmt: UserCommentDto) => {
        this.comments.push(cmt);
    });
    this._commentsService.getTotalComments.subscribe((total: number) => {
      this.totalCmt = total;
    });
  }

  // Lấy vị trí hiện tại của người dùng
  getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
          console.log('Your Lat:', this.lat);
          console.log('Your Lng:', this.lng);
          // Lấy tên địa điểm từ tọa độ
          this.getLocationName(this.lat, this.lng);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }

  getLocationName(lat: number, lng: number) {
    this._mapsAPILoader.load().then(() => {
      const geocoder = new google.maps.Geocoder();
      const latlng = new google.maps.LatLng(lat, lng);
      geocoder.geocode({ 'location': latlng }, (results, status) => {
        if (status === 'OK') {
          if (results[0]) {
            this.locationName = results[0].formatted_address;
          } else {
            console.error('No results found');
          }
        } else {
          console.error('Geocoder failed due to: ' + status);
        }
      });
    });
  }

  // onMarkerClick() {
  //   this.getLocationName(this.lat, this.lng);
  // }

  getLocationForPost(address: string): void {
    this._mapsAPILoader.load().then(() => {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ 'address': address }, (results, status) => {
        if (status === 'OK') {
          if (results[0]) {
            this.postLat = results[0].geometry.location.lat();
            this.postLng = results[0].geometry.location.lng();
            this.getLocationNamePost(this.postLat, this.postLng);
            // Thiết lập vị trí của bản đồ tới vị trí của bài đăng
            this.map.setCenter({ lat: this.postLat, lng: this.postLng });
            this.map.setZoom(15);
          } else {
            console.error('No results found');
          }
        } else {
          console.error('Geocoder failed due to: ' + status);
        }
      });
    });
  }

  getLocationNamePost(postLat: number, postLng: number) {
    this._mapsAPILoader.load().then(() => {
      const geocoder = new google.maps.Geocoder();
      const latlng = new google.maps.LatLng(postLat, postLng);
      geocoder.geocode({ 'location': latlng }, (results, status) => {
        if (status === 'OK') {
          if (results[0]) {
            this.locationNamePost = results[0].formatted_address;
          } else {
            console.error('No results found');
          }
        } else {
          console.error('Geocoder failed due to: ' + status);
        }
      });
    });
  }
  // Lấy vị trí của bài đăng
  showPostLocation(): void {
    if (this.post.address + ', ' + this.post.district + ', ' + this.post.city) {
      this.getLocationForPost(this.post.address + ', ' + this.post.district + ', ' + this.post.city);
    } else {
      console.error('Post address is not available');
    }
  }
  // onMarkerPostClick() {
  //   this.getLocationNamePost(this.post.address + ', ' + this.post.district + ', ' + this.post.city);
  // }

  // Xử lý chỉ đường đi bằng phương thức đi bộ
  onMapReady(map: google.maps.Map) {
    this.map = map;
  }

  getDriving() {
    if (!this.map) {
      console.error('Map is not initialized yet');
      return;
    }
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer();
    this.directionsRenderer.setMap(this.map);
    const request: google.maps.DirectionsRequest = {
      origin: new google.maps.LatLng(this.lat, this.lng),
      destination: new google.maps.LatLng(this.postLat, this.postLng),
      // destination: this.post.address + ', ' + this.post.district + ', ' + this.post.city,
      travelMode: google.maps.TravelMode.DRIVING
    };

    this.directionsService.route(request, (response, status) => {
      if (status == 'OK') {
        this.directionsRenderer.setDirections(response);
        // this.getLocationNamePost(this.post.address + ', ' + this.post.district + ', ' + this.post.city);
      } else {
        console.error('Directions request failed due to ' + status);
      }
    });
  }

  getTransit() {
    if (!this.map) {
      console.error('Map is not initialized yet');
      return;
    }
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer();
    this.directionsRenderer.setMap(this.map);
    const request: google.maps.DirectionsRequest = {
      origin: new google.maps.LatLng(this.lat, this.lng),
      destination: new google.maps.LatLng(this.postLat, this.postLng),
      // destination: this.post.address + ', ' + this.post.district + ', ' + this.post.city,
      travelMode: google.maps.TravelMode.TRANSIT
    };

    this.directionsService.route(request, (response, status) => {
      if (status == 'OK') {
        this.directionsRenderer.setDirections(response);
        // this.getLocationNamePost(this.post.address + ', ' + this.post.district + ', ' + this.post.city);
      } else {
        console.error('Directions request failed due to ' + status);
      }
    });
  }

  toggleTransit() {
    if (this.directionsActive) {
      this.clearDirections();
    } else{
      this.startTransit();
    }
  }

  toggleDrive() {
    if (this.directionsActive) {
      this.clearDirections();
    } else{
      this.startDrive();;
    }
  }

  startTransit() {
    this.getTransit();
    this.directionsActive = true;
  }

  startDrive() {
    this.getDriving();
    this.directionsActive = true;
  }

  clearDirections() {
    // Xoá chỉ đường khỏi bản đồ
    this.directionsRenderer.setMap(null);
    this.directionsActive = false;
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
      this.postUser = result;
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

  // BÌNH LUẬN

  show(CommentID?: number): void {
    if (CommentID) {
      this._userCommentService.getCommentById(CommentID).subscribe((result) => {
        this.comment = result.commentContent;
        this.editMode = true;
        this.commentIdToUpdate = CommentID;
      })
    } else {
      this.addComment();
    }
  }

  onCommentInput() {
    if (!this.comment) {
      this.editMode = false;
    }
  }

  isUserOwner(commentUserId: number): boolean {
    return abp.session.userId === commentUserId;
  }

  addComment() {
    if (this.editMode) {
      this.editComment();
      return;
    }

    this.userComment = new UserCommentDto();
    this.userComment.postId = this.postId;
    this.userComment.tenantId = abp.session.tenantId;
    this.userComment.commentContent = this.comment;

    this._userCommentService.addComment(this.postId, this.userComment).subscribe(() => {
      this.notify.success('Thêm bình luận thành công');
      this.getComments();
      this.getTotalComments();
      this.comment = "";
    });
  }

  editComment() {
    this.userComment.id = this.commentIdToUpdate;
    this.userComment.commentContent = this.comment;

    this.userComment.commentContent = this.comment;
    this._userCommentService.update(this.userComment).subscribe(() => {
      this.notify.success('Sửa bình luận thành công');
      this.getComments();
      this.comment = "";
      this.editMode = false;
    });
  }

  deleteComment(CommentID?: number) {
    this._userCommentService.deleteComment(CommentID)
    .subscribe(() => {
      this.notify.success('Xóa bình luận thành công');
      this.getComments();
      this.getTotalComments();
      this.comment = "";
    })
  }

  getComments() {
    this._userCommentService.getAllComment(this.postId)
      .pipe(finalize(() => {}))
      .subscribe(result => {
        result.forEach(comment => {
          const timeAgo = moment().diff(comment.creationTime);
          comment.timeAgo = this.calculateTimeAgo(timeAgo);
        });
        this.commentsView = result;
      });
  }

  getTotalComments() {
    this._userCommentService.getTotalComment(this.postId).subscribe(total => {
      this.totalCmt = total;
    });
  }


  calculateTimeAgo(timeDiff: number): string {
    let timeAgo: string;

    if (timeDiff < 60000) {
      timeAgo = Math.floor(timeDiff / 1000) + ' giây trước';
    } else if (timeDiff < 3600000) { // Dưới 1 giờ
      timeAgo = Math.floor(timeDiff / 60000) + ' phút trước';
    } else if (timeDiff < 86400000) { // Dưới 1 ngày
      timeAgo = Math.floor(timeDiff / 3600000) + ' giờ trước';
    } else {
      timeAgo = Math.floor(timeDiff / 86400000) + ' ngày trước';
    }

    return timeAgo;
  }
}
