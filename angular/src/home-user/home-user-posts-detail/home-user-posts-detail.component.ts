import { AgmMap, MapsAPILoader } from '@agm/core';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommentsService } from '@app/_services/comments.service';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { AppComponentBase } from '@shared/app-component-base';
import { CreateOrEditSchedulesDto, GetPostForViewDto, ManageAppointmentSchedulesServiceProxy, ManagePostsServiceProxy, PhotoDto, PostLikeDto, SessionServiceProxy, UserCommentDto, UserCommentServiceProxy, UserCommentViewDto, ViewPostServiceProxy } from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-home-user-posts-detail',
  templateUrl: './home-user-posts-detail.component.html',
  styleUrls: ['./home-user-posts-detail.component.css'],
  providers: [ViewPostServiceProxy, ManageAppointmentSchedulesServiceProxy, UserCommentServiceProxy]
})
export class HomeUserPostsDetailComponent extends AppComponentBase implements OnInit {

  isLogin: boolean = false;
  showLogin: number;
  postId: number;
  post: GetPostForViewDto = new GetPostForViewDto();
  schedule: CreateOrEditSchedulesDto = new CreateOrEditSchedulesDto();
  likepost: PostLikeDto = new PostLikeDto();
  roomStatus:boolean = false;
  buttonDisabled: boolean = false;
  postPhotos: PhotoDto[] = [];
  statusLike: boolean = false;
  statusSchedule: boolean = false;

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
  totalCmt: number;
  editMode: boolean = false;
  commentIdToUpdate: number;

  constructor(
    injector: Injector,
    public _postService: ViewPostServiceProxy,
    public _postScheduleService: ManageAppointmentSchedulesServiceProxy,
    public _userCommentService: UserCommentServiceProxy,
    private _sessionService: SessionServiceProxy,
    private _commentsService: CommentsService,
    private route: ActivatedRoute,
    private _mapsAPILoader: MapsAPILoader
    ) {
      super(injector);
    }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.postId = +params['id'];
      this.getPostDetails(this.postId);
      this.getStatusRoom(this.postId);
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

    this.showLogin = this.appSession.getShownLoginId();
    if (this.showLogin != null) {
      this.isLogin = true;
      this.getStatus();
    } else {
      this.isLogin = false;
    }
    // this.getStatusRoom();
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

  getStatus(): void {
    this._postService.statusRoomLike(this.postId).subscribe((
      res => {
        this.statusLike = res;
      }
    ))
  }

  getStatusRoom(id: number): void {
    this._postService.statusRoom(id).subscribe((res=>{
        this.roomStatus = res;
        console.log(this.roomStatus);
        if (this.roomStatus == true) {
          this.buttonDisabled = false;
        } else {
          this.buttonDisabled = true;
        }
    }))
  }

  getStatusSchedule(): void {
    this._postScheduleService.statusSchedule(this.post).subscribe((
      res => {
        this.statusSchedule = res;
      }
    ))
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

  getPostDetails(postId: number): void {
    // this.getStatusRoom();
    // this.getStatus();
    this._postService.getForEdit(postId).subscribe((result) => {
      this.post = result;
      this.postPhotos = result.photos;
      // if (this.roomStatus == true) {
      //   this.buttonDisabled = false;
      // } else {
      //   this.buttonDisabled = true;
      // }
      this.galleryImages = this.getImages();
    });
  }

  booking(postsId: number): void {
    this.post.id = postsId;
    this._postScheduleService.createSchedule(this.post).subscribe((result) => {
      this.schedule = result;
      this.notify.success(this.l('YouAreScheduled'));
    })
    // this.getStatusSchedule();
    // if (this.statusSchedule == true) {
    //   this.notify.warn(this.l('Bài đăng đã được lên lịch hoặc đã có người đặt'))
    // }
    // else {
    //   this.post.id = postsId;
    //   this._postScheduleService.createSchedule(this.post).subscribe((result) => {
    //     this.schedule = result;
    //     this.notify.success(this.l('YouAreScheduled'));
    //   })
    // }
  }

  hasMainPhoto(post: GetPostForViewDto): boolean {
    return post.photos && post.photos.some(photo => photo.isMain == true);
  }

  getMainPhotoUrl(post: GetPostForViewDto): string {
    const mainPhoto = post.photos.find(photo => photo.isMain);
    return mainPhoto ? mainPhoto.url
      : 'data:image/jpeg;base64,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';
  }

  favourite(postId: number): void {
    this.post.id = postId;
    this.getStatus();
    if (this.statusLike) {
      this.notify.warn("Bạn đã yêu thích bài đăng này");
    } else {
      this._postService.likePosts(this.post).subscribe((result) => {
        this.likepost = result;
        this.notify.success('Cảm ơn bạn đã yêu thích bài đăng này');
      })
    }
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
