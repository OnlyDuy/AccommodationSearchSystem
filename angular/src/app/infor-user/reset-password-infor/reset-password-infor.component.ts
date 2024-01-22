import { Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { AbpValidationError } from '@shared/components/validation/abp-validation.api';
import { ChangePasswordDto, InforUserServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-reset-password-infor',
  templateUrl: './reset-password-infor.component.html',
  styleUrls: ['./reset-password-infor.component.css']
})
export class ResetPasswordInforComponent extends AppComponentBase {

  id: number;
  saving = false;
  changePasswordDto = new ChangePasswordDto();
  newPasswordValidationErrors: Partial<AbpValidationError>[] = [
    {
      name: 'pattern',
      localizationKey:
        'PasswordsMustBeAtLeast8CharactersContainLowercaseUppercaseNumber',
    },
  ];
  confirmNewPasswordValidationErrors: Partial<AbpValidationError>[] = [
    {
      name: 'validateEqual',
      localizationKey: 'PasswordsDoNotMatch',
    },
  ];

  constructor(
    injector: Injector,
    private userServiceProxy: InforUserServiceProxy,
    // private router: Router,
    public bsModalRef: BsModalRef
  ) {
    super(injector);
  }

  changePassword() {
    this.saving = true;

    this.userServiceProxy
    .changeInforPassword(this.changePasswordDto)
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe((success) => {
        if (success) {
          abp.message.success('Password changed successfully', 'Success');
          this.bsModalRef.hide();
        }
      });
  }
}
