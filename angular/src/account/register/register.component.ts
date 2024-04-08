import { Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AppComponentBase } from '@shared/app-component-base';
import {
  AccountServiceProxy,
  RegisterInput,
  RegisterOutput
} from '@shared/service-proxies/service-proxies';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppAuthService } from '@shared/auth/app-auth.service';

@Component({
  templateUrl: './register.component.html',
  animations: [accountModuleAnimation()]
})
export class RegisterComponent extends AppComponentBase implements OnInit  {
  model: RegisterInput = new RegisterInput();
  saving = false;

  selectedRoles: string[] = ["Chủ trọ", "Người thuê trọ"];

  constructor(
    injector: Injector,
    private _accountService: AccountServiceProxy,
    private _router: Router,
    private authService: AppAuthService
  ) {
    super(injector);
  }


  ngOnInit() {
    this.model.roleNames = [""];
  }

  save(): void {
    this.saving = true;
    if (this.model.roleNames.includes("Chủ trọ")) {
      this.model.roleNames = ["Chủ trọ"];
    } else if (this.model.roleNames.includes("Người thuê trọ")) {
      this.model.roleNames = ["Người thuê trọ"];
    } else {
      // Nếu không có lựa chọn hoặc lựa chọn khác "Chủ trọ" và "Người thuê trọ", gán một mảng rỗng
      this.model.roleNames = [];
    }
    this._accountService
      .register(this.model)
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe((result: RegisterOutput) => {
        if (!result.canLogin) {
          this.notify.success(this.l('SuccessfullyRegistered'));
          this._router.navigate(['/login']);
          return;
        }

        // Autheticate
        this.saving = true;
        this.authService.authenticateModel.userNameOrEmailAddress = this.model.userName;
        this.authService.authenticateModel.password = this.model.password;
        this.authService.authenticate(() => {
          this.saving = false;
        });
      });
  }
}
