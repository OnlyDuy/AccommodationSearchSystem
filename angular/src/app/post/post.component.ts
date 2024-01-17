import { Component, Injector } from '@angular/core';
import { AppComponent } from '@app/app.component';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent extends AppComponentBase {
  currentNameRole = abp.session.tenantId;
  isHost: boolean = false;

  constructor(
    injector: Injector,
  ) {
    super(injector);
    if (abp.session.tenantId == null) {
      this.isHost = true;
    }
  }

}
