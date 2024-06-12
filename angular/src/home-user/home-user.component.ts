import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ViewPostServiceProxy } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-home',
  templateUrl: './home-user.component.html',
  styleUrls: ['./home-user.component.css'],
  providers: [ViewPostServiceProxy]
})
export class HomeUserComponent extends AppComponentBase implements OnInit {

  constructor(injector: Injector, public _postService: ViewPostServiceProxy) {
    super(injector);
  }

  ngOnInit() {
  }


}
