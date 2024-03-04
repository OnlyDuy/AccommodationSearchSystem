import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { CreateOrEditIPostDto, GetPostForEditOutput, GetPostForViewDto, ManagePostsServiceProxy, SessionServiceProxy } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css'],
  providers: [ManagePostsServiceProxy],
})
export class PostDetailComponent extends AppComponentBase implements OnInit {
  postId: number;
  post: CreateOrEditIPostDto = new CreateOrEditIPostDto();

  constructor(
    injector: Injector,
    public _postService: ManagePostsServiceProxy,
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
    this._postService.getLoyaltyGiftItemForEdit(postId).subscribe((result) => {
      this.post = result.createOrEditPost;
    });
  }
}
