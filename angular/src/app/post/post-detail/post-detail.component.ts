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
} from "@shared/service-proxies/service-proxies";
import { environment } from "environments/environment";
import { FileItem, FileUploader } from "ng2-file-upload";
import {
  NgxGalleryAnimation,
  NgxGalleryImage,
  NgxGalleryOptions,
} from "@kolkov/ngx-gallery";
import { AgmMap, MapsAPILoader } from "@agm/core";

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


  constructor(
    injector: Injector,
    public _postService: ManagePostsServiceProxy,
    private _sessionService: SessionServiceProxy,
    private route: ActivatedRoute,
    private _mapsAPILoader: MapsAPILoader
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
    this.getCurrentLocation();
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
