import { Component, Injector, OnInit } from '@angular/core';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { EditInforUserComponent } from './edit-infor-user//edit-infor-user.component';
import { ResetPasswordInforComponent } from './reset-password-infor/reset-password-infor.component';
import { finalize } from 'rxjs/operators';
import { InforUserServiceProxy, UserDto } from '@shared/service-proxies/service-proxies';
import { appModuleAnimation } from '@shared/animations/routerTransition';

class PagedUsersRequestDto extends PagedRequestDto {
  keyword: string;
  isActive: boolean | null;
}

@Component({
  selector: 'app-infor-user',
  templateUrl: './infor-user.component.html',
  styleUrls: ['./infor-user.component.css'],
  animations: [appModuleAnimation()]
})
export class InforUserComponent extends PagedListingComponentBase<UserDto> {

  items: UserDto[] = [];
  keyword = '';
  isActive: boolean | null;
  advancedFiltersVisible = false;
  shownLoginName = '';
  shownLoginSurName = '';
  shownLoginEmail = '';
  shownLoginPhoneNumber = '';
  id: number;
  userName: string;
  name: string;
  surname: string;
  emailAddress: string;
  phoneNumber: string;
  fullName: string | undefined;
  roleNames: string[] | undefined;

  constructor(
    injector: Injector,
    private _userService: InforUserServiceProxy,
    private _modalService: BsModalService
  ) {
    super(injector);
  }


  editUser(user: UserDto): void {
    user.id = this.appSession.getShownLoginId()
    this.showCreateOrEditUserDialog(user.id);
  }

  public resetPassword(user: UserDto): void {
    this.showResetPasswordUserDialog(user.id);
  }


  protected list(
    request: PagedUsersRequestDto,
    pageNumber: number,
    finishedCallback: Function
  ): void {
    request.keyword = this.keyword;
    request.isActive = this.isActive;
    this.id = this.appSession.getShownLoginId();
    this._userService.get(this.id)
      .pipe(
          finalize(() => {
              finishedCallback();
            })
          )
      .subscribe((result : UserDto) => {
        this.items = [result];
        this.id = result.id;
        this.userName = result.userName;
        this.name = result.name;
        this.surname = result.surname;
        this.emailAddress = result.emailAddress;
        this.phoneNumber = result.phoneNumber;
        this.fullName = result.fullName;
        this.roleNames = result.roleNames;
      });
  }

  protected delete(user: UserDto): void {
    abp.message.confirm(
      this.l('UserDeleteWarningMessage', user.fullName),
      undefined,
      (result: boolean) => {
        if (result) {
          this._userService.delete(user.id).subscribe(() => {
            abp.notify.success(this.l('SuccessfullyDeleted'));
            this.refresh();
          });
        }
      }
    );
  }

  private showResetPasswordUserDialog(id?: number): void {
    this._modalService.show(ResetPasswordInforComponent, {
      class: 'modal-lg',
      initialState: {
        id: id,
      },
    });
  }

  private showCreateOrEditUserDialog(id?: number): void {
    let createOrEditUserDialog: BsModalRef;
    id = this.appSession.getShownLoginId();
    if (id) {
      createOrEditUserDialog = this._modalService.show(
        EditInforUserComponent,
        {
          class: 'modal-lg',
          initialState: {
            id: id,
          },
        }
      );
    }
  }
}
