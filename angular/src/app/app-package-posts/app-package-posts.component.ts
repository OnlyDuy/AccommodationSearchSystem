import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { PackagePostsServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppPackagePostsVipProComponent } from './app-package-posts-vip-pro/app-package-posts-vip-pro.component';
import { AppPackagePostsVipComponent } from './app-package-posts-vip/app-package-posts-vip.component';


@Component({
  selector: 'app-package-posts',
  templateUrl: './app-package-posts.component.html',
  styleUrls: ['./app-package-posts.component.css'],
  providers: [PackagePostsServiceProxy]
})
export class AppPackagePostsComponent extends AppComponentBase implements OnInit {


  @ViewChild('AppPackagePostsVipPro') AppPackagePostsVipPro: AppPackagePostsVipProComponent;
  @ViewChild('AppPackagePostsVip') AppPackagePostsVip: AppPackagePostsVipComponent;

  isAdmin: boolean = false;
  shownLogin: number;

  constructor(
    injector: Injector,
    public _packageService: PackagePostsServiceProxy
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.shownLogin = this.appSession.getShownLoginRoleId();
    if (this.shownLogin == 3) {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }
  }

  createPackageVIPpro(): void {
    this.AppPackagePostsVipPro.show();
  }

  createPackageVIP(): void {
    this.AppPackagePostsVip.showVip();
  }
}
