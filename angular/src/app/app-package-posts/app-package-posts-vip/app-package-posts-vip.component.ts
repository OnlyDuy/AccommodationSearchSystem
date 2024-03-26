import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { PackagePostDto, PackagePostsServiceProxy, SessionServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';

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
