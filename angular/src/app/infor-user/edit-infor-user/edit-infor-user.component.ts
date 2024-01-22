
import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { RoleDto, UserDto, InforUserServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { forEach as _forEach, includes as _includes, map as _map } from 'lodash-es';

@Component({
  selector: 'app-edit-infor-user',
  templateUrl: './edit-infor-user.component.html',
  styleUrls: ['./edit-infor-user.component.css']
})

export class EditInforUserComponent extends AppComponentBase implements OnInit {

  saving = false;
  user = new UserDto();
  roles: RoleDto[] = [];
  checkedRolesMap: { [key: string]: boolean } = {};
  id: number;

  @Output() onSave = new EventEmitter<any>();

  constructor(
    injector: Injector,
    public _userService: InforUserServiceProxy,
    public bsModalRef: BsModalRef
  ) {
    super(injector);
  }

  ngOnInit(): void {
    // this.id = this.appSession.getShownLoginId();
    this._userService.get(this.id).subscribe((result) => {
      this.user = result;

      this._userService.getInforRoles().subscribe((result2) => {
        this.roles = result2.items;
        this.setInitialRolesStatus();
      });
    });
  }

  setInitialRolesStatus(): void {
    _map(this.roles, (item) => {
      this.checkedRolesMap[item.normalizedName] = this.isRoleChecked(
        item.normalizedName
      );
    });
  }

  isRoleChecked(normalizedName: string): boolean {
    return _includes(this.user.roleNames, normalizedName);
  }

  onRoleChange(role: RoleDto, $event) {
    this.checkedRolesMap[role.normalizedName] = $event.target.checked;
  }

  getCheckedRoles(): string[] {
    const roles: string[] = [];
    _forEach(this.checkedRolesMap, function (value, key) {
      if (value) {
        roles.push(key);
      }
    });
    return roles;
  }

  save(): void {
    this.saving = true;

    this.user.roleNames = this.getCheckedRoles();

    this._userService.update(this.user).subscribe(
      () => {
        this.notify.info(this.l('SavedSuccessfully'));
        this.bsModalRef.hide();
        this.onSave.emit();
      },
      () => {
        this.saving = false;
      }
    );
  }
}


