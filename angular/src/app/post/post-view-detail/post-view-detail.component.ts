import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { CreateOrEditIPostDto, CreateOrEditSchedulesDto, GetPostForViewDto, SessionServiceProxy, ViewPostServiceProxy } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-post-view-detail',
  templateUrl: './post-view-detail.component.html',
  styleUrls: ['./post-view-detail.component.css'],
  providers: [ViewPostServiceProxy]
})
export class PostViewDetailComponent extends AppComponentBase implements OnInit {
  postId: number;
  post: GetPostForViewDto = new GetPostForViewDto();

  schedule: CreateOrEditSchedulesDto = new CreateOrEditSchedulesDto();

  constructor(
    injector: Injector,
    public _postService: ViewPostServiceProxy,
    private _sessionService: SessionServiceProxy,
    private route: ActivatedRoute
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.postId = +params['id'];
      this.getPostDetails(this.postId);
    });
  }

  getPostDetails(postId: number): void {
    this._postService.getForEdit(postId).subscribe((result) => {
      this.post = result;
    });
  }

  booking() {

  }

  favourite() {

  }
}
