import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { GetPackageViewDto, PackagePostDto, PackagePostsServiceProxy, SessionServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { AppPackagePostsComponent } from '../app-package-posts.component';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'AppPackagePostsEdit',
  templateUrl: './app-package-posts-edit.component.html',
  styleUrls: ['./app-package-posts-edit.component.css'],
  providers: [PackagePostsServiceProxy]
})
export class AppPackagePostsEditComponent extends AppComponentBase implements OnInit {
  @ViewChild("editPackageModal", { static: true }) modal: ModalDirective;
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

  checkSave: boolean = false;
  active: boolean = false;
  saving: boolean = false;
  packages: GetPackageViewDto = new GetPackageViewDto();
  tenantId: number;
  packagePostsComponent: AppPackagePostsComponent;
  minDate: Date;
  maxDate: Date;

  constructor(
    injector: Injector,
    public _packageService: PackagePostsServiceProxy,
    private bsDatepickerConfig: BsDatepickerConfig,
    public _packagePostsComponent: AppPackagePostsComponent,
    private _sessionService: SessionServiceProxy
  ) {
    super(injector);
    this.bsDatepickerConfig.dateInputFormat = 'DD/MM/YYYY';
    this.packagePostsComponent = _packagePostsComponent;
    this.minDate = new Date();
    this.minDate.getDate();
    // this.maxDate = new Date();
    // this.maxDate.setFullYear(this.maxDate.getMonth() - 6);
  }

  ngOnInit(): void {
    this._sessionService.getCurrentLoginInformations().subscribe((res) => {
      this.tenantId = res.tenant.id;
    });

  }

  showPackage(PackageId?: number): void {
    this._packageService
    .getPackageForEdit(PackageId)
    .subscribe((result) => {
      this.packages = result.getPackageViewDtos;
      this.active = true
      this.modal.show();
    });
  }

  save(): void {
    this.saving = true;
    this.packages.tenantId = this.tenantId;
    this._packageService
      .editPackage(this.packages)
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe(() => {
        this.notify.info(this.l("SavedSuccessfully"));
        this.packagePostsComponent.updateTable();
        this.close();

        this.modalSave.emit();
        this.packages = null;
        this.saving = false;
      });
  }

  close(): void {
    this.active = false;
    this.modal.hide();
  }

}
