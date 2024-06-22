import { VNPayConfig } from './../../../shared/commom/models/vnpay-config.model';
import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { PackagePostDto, PackagePostsServiceProxy, SessionServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import * as QRCode from 'qrcode-generator';
// import { VNPay  } from 'vn-payments';

@Component({
  selector: 'AppPackagePostsVip',
  templateUrl: './app-package-posts-vip.component.html',
  styleUrls: ['./app-package-posts-vip.component.css'],
  providers: [PackagePostsServiceProxy]
})
export class AppPackagePostsVipComponent extends AppComponentBase implements OnInit {

  @ViewChild("packagePostsVipModal", { static: true }) modal: ModalDirective;
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
    this.getStatus();
  }

  getStatus(): void {
    this._packageService.statusCreate().subscribe((
      res => {
        this.statusPackage = res;
      }
    ))
  }

  showVip(PackageId?: number): void {
    this.getStatus();
    this.packages = new PackagePostDto();
    this.packages.id = PackageId;

    // Gán giá trị trực tiếp cho các trường
    this.packages.packageType = 'Gói VIP';
    this.packages.packageDetail = 'Gói này sẽ giúp bạn có thời hạn đăng bài trong 3 tháng. Bài đăng của bạn sẽ được ở vị trí tốt tại trang chủ của ứng dụng này';

    this.active = true;
    this.modal.show();
  }

  save(): void {
    this.saving = true;
    this.packages.tenantId = this.tenantId;
    this.packages.amount = 199000;
    this.packages.description = "XNGVIP" + this.packages.hostPhoneNumber;
    this.getStatus();
    this.message.confirm('', 'Bạn muốn đăng ký gói đăng bài này ?', (isConfirme) => {
      if (isConfirme) {
        if (this.statusPackage) {
          this.notify.warn("Bạn đã đăng ký gói đăng bài trước đó");
          this.close();
        } else {
          this._packageService
            .paymentResult(this.packages)
            .subscribe((response) => {
              window.open(response, '_self');
              // this.notify.info(this.l("SavedSuccessfully"));
              this.modalSave.emit();
            });
        }
      } else {
        // Xử lý trường hợp người dùng không xác nhận
        this.saving = false; // Đặt lại trạng thái saving về false
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
