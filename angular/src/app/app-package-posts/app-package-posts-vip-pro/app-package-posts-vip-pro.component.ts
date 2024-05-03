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
  showQR: boolean = false;

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
    this.packages.tenantId = this.tenantId;
    this.packages.amount = 399000;
    this.packages.description = "XNGVIP" + this.packages.hostPhoneNumber;
    this.getStatus();
    this.message.confirm('', 'Bạn muốn đăng ký gói đăng bài này ?', (isConfirme) => {
      if (isConfirme) {
        if (this.statusPackage) {
          this.notify.warn("Bạn đã đăng ký gói đăng bài trước đó");
          this.close();
        } else {
          this._packageService
            .createPackage(this.packages)
            .subscribe((response) => {
              this.close();
              window.open(response.paymentUrl, '_blank');
              this.notify.info(this.l("SavedSuccessfully"));
              this.modalSave.emit();
              this.packages = null;

            });
        }
      }
    })
  }

  close(): void {
    this.active = false;
    this.saving = false;
    this.modal.hide();
  }

  showQRCode(): void {
    this.showQR = !this.showQR; // Khi nhấn nút, đảo ngược trạng thái hiển thị QR code
  }

}
