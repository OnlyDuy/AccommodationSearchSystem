import {
  Component,
  ChangeDetectionStrategy,
  Injector,
  OnInit
} from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'sidebar-user-panel',
  templateUrl: './sidebar-user-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarUserPanelComponent extends AppComponentBase
  implements OnInit {
  shownLoginName = '';
  shownLoginRoleId: number;
  shownLoginNameRole = '';


  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    this.shownLoginName = this.appSession.getShownLoginName();
    this.shownLoginRoleId = this.appSession.getShownLoginRoleId();
    if (this.shownLoginRoleId == 4 ) {
      this.shownLoginNameRole = 'Chủ trọ';
    } else if (this.shownLoginRoleId == 5) {
      this.shownLoginNameRole = 'Người thuê trọ';
    } else {
      this.shownLoginNameRole = 'Admin'
    }
  }
}
