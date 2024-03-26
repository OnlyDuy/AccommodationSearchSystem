import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { PackagePostDto, PackagePostsServiceProxy, SessionServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'AppPackagePostsVipPro',
  templateUrl: './app-package-posts-vip-pro.component.html',
  styleUrls: ['./app-package-posts-vip-pro.component.css']
})
export class AppPackagePostsVipProComponent extends AppComponentBase implements OnInit {

  @ViewChild("packagePostsVipProModal", { static: true }) modal: ModalDirective;
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

  active: boolean = false;
  checkSave: boolean = false;
  saving: boolean = false;
  tenantId: number;
  packages: PackagePostDto = new PackagePostDto();
  statusPackage: boolean = false;

  constructor(
    injector: Injector,
    public _packageService: PackagePostsServiceProxy,
    private _sessionService: SessionServiceProxy
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.getStatus(); // Kiểm tra trạng thái khi tải trang
  }

  getStatus(): void {
    this._packageService.statusCreate().subscribe((
      res => {
        this.statusPackage = res;
      }
    ))
  }

  show(PackageId?: number): void {
    this.getStatus();
    this.packages = new PackagePostDto();
    this.packages.id = PackageId;

    // Gán giá trị trực tiếp cho các trường
    this.packages.packageType = 'Gói VIP pro';
    this.packages.packageDetail = 'Gói này sẽ giúp bạn có thời hạn đăng bài trong 6 tháng. Bài đăng của bạn sẽ được ưu ái ở vị trí tốt nhất tại trang chủ của ứng dụng này';

    this.active = true;
    this.modal.show();
  }

  save(): void {
    this.saving = true;
    this.getStatus();
    if (this.statusPackage) {
      this.notify.warn("Bạn đã đăng ký gói đăng bài trước đó");
      this.close();
    } else {
      this._packageService
        .createPackage(this.packages)
        .subscribe(() => {
          this.notify.info(this.l("SavedSuccessfully"));
          this.close();

          this.modalSave.emit();
          this.packages = null;

        });
    }
  }

  close(): void {
    this.active = false;
    this.saving = false;
    this.modal.hide();
  }


}
