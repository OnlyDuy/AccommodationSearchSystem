import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { EntityDto } from '@shared/paged-listing-component-base';
import { CreateOrEditIPostDto, CreateOrEditSchedulesDto, GetPostForViewDto, ManageAppointmentSchedulesServiceProxy, SessionServiceProxy, ViewPostServiceProxy } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-post-view-detail',
  templateUrl: './post-view-detail.component.html',
  styleUrls: ['./post-view-detail.component.css'],
  providers: [ViewPostServiceProxy, ManageAppointmentSchedulesServiceProxy]
})
export class PostViewDetailComponent extends AppComponentBase implements OnInit {
  postId: number;
  post: GetPostForViewDto = new GetPostForViewDto();
  schedule: CreateOrEditSchedulesDto = new CreateOrEditSchedulesDto();

  constructor(
    injector: Injector,
    public _postService: ViewPostServiceProxy,
    public _postScheduleService: ManageAppointmentSchedulesServiceProxy,
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

  booking(postsId: number): void {
    this.post.id = postsId;
    this._postScheduleService.createSchedule(this.post).subscribe((result) => {
      this.schedule = result;
      this.notify.success(this.l('YouAreScheduled'));
    })
  }

  favourite() {

  }
}
