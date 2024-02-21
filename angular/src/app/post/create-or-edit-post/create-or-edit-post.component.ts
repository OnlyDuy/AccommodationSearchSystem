
import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { CreateOrEditIPostDto, ManagePostsServiceProxy, SessionServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { PostComponent } from '../post.component';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'CreateOrEditPost',
  templateUrl: './create-or-edit-post.component.html',
  styleUrls: ['./create-or-edit-post.component.css'],
  providers: [ManagePostsServiceProxy],
})
export class CreateOrEditPostComponent extends AppComponentBase {
  @ViewChild("createOrEditModal", { static: true }) modal: ModalDirective;
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

  checkSave: boolean = false;
  active: boolean = false;
  saving: boolean = false;
  posts: CreateOrEditIPostDto = new CreateOrEditIPostDto();
  tenantId: number;
  postComponent: PostComponent;


  constructor(
    injector: Injector,
    public _postService: ManagePostsServiceProxy,
    public _postComponent: PostComponent,
    private _sessionService: SessionServiceProxy
  ) {
    super(injector);
    this.postComponent = _postComponent;
  }


   ngOnInit() {
    this._sessionService.getCurrentLoginInformations().subscribe((res) => {
      this.tenantId = res.tenant.id;
    });

  }

  show(PostId?: number): void {
    if (!PostId) {
      this.posts = new CreateOrEditIPostDto();
      this.posts.id = PostId;
      this.active = true;
      this.modal.show();

    } else {
      this._postService
        .getLoyaltyGiftItemForEdit(PostId)
        .subscribe((result) => {
          this.posts = result.createOrEditPost;
          this.active = true
          this.modal.show();
        });
    }
  }

  save(): void {
    this.saving = true;
    this.posts.tenantId = this.tenantId;
    this._postService
      .createOrEdit(this.posts)
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe(() => {
        this.notify.info(this.l("SavedSuccessfully"));
        this.postComponent.updateTable();
        this.close();

        this.modalSave.emit();
        this.posts = null;
        this.saving = false;
      });
  }

  close(): void {
    this.active = false;
    this.modal.hide();
  }
}

