import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { AppAuthService } from '@shared/auth/app-auth.service';

@Component({
  selector: 'app-header-home-user',
  templateUrl: './header-home-user.component.html',
  styleUrls: ['./header-home-user.component.css']
})
export class HeaderHomeUserComponent extends AppComponentBase {

  shownLogin: number;
  isLogin: boolean = false;
  shownLoginName: string;

  constructor(
    injector: Injector,
    private _authService: AppAuthService
  ) {
    super(injector);
  }


  ngOnInit(): void {
    this.shownLogin = this.appSession.getShownLoginId();
    if (this.shownLogin != null) {
      this.isLogin = true;
    } else {
      this.isLogin = false;
    }
    this.shownLoginName = this.appSession.getShownLoginName();
  }

  logout(): void {
    this._authService.logout();
  }

}
