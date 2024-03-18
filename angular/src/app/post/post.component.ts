import { PaginationParamsModel } from './../../shared/commom/models/base.model';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { GetPostForViewDto, ManagePostsServiceProxy, CreateOrEditIPostDto } from '@shared/service-proxies/service-proxies';
import { ceil } from 'lodash-es';
import { Table } from 'primeng/table';
import { CreateOrEditPostComponent } from './create-or-edit-post/create-or-edit-post.component';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
  providers: [ManagePostsServiceProxy]
})
export class PostComponent extends AppComponentBase {
  // currentNameRole = abp.session.tenantId;
  // isHost: boolean = false;

  @ViewChild('CreateOrEditPost') CreateOrEditPost: CreateOrEditPostComponent;

  filterText;
  sorting: string = "";
  paginationParams: PaginationParamsModel;
  selectedPost: GetPostForViewDto[];
  post: GetPostForViewDto;
  isLoading = false;
  maxResultCount: number = 20;
  rowData: GetPostForViewDto[];
  selectedRow: any;
  visible: boolean = true;

  constructor(
    injector: Injector,
    public _postService: ManagePostsServiceProxy
  ) {
    super(injector);
    // if (abp.session.tenantId == null) {
    //   this.isHost = true;
    // }
  }

  ngOnInit() {
    this.rowData = [];
    this.paginationParams = { pageNum: 1, pageSize: 20, totalCount: 0 };
    this.getAll(this.paginationParams).subscribe(data => {
      console.log(data.items);
      this.rowData = data.items;
      this.paginationParams.totalPage = ceil(data.totalCount / this.maxResultCount);
      this.paginationParams.totalCount = data.totalCount;
    });
  }

  getAll(paginationParams: PaginationParamsModel) {
    return this._postService.getAllForHost(
      this.filterText,
      this.sorting ?? null,
      paginationParams ? paginationParams.skipCount : 0,
      paginationParams ? paginationParams.pageSize : 20,

    );
  }

  createPost() {
    this.CreateOrEditPost.show();

  }
  editPost() {
    this.CreateOrEditPost.show(this.selectedRow.id);
  }


  deletePost() {
    this.message.confirm('', this.l('AreYouSureWantToDelete'), (isConfirme) => {
      if (isConfirme) {
        this._postService.deletePost(this.selectedRow.id)
          .subscribe(() => {
            this.notify.success(this.l('SuccessfullyDeleted'));
            this.updateTable();
          })
      }
    })
  }

  clear(table: Table) {
    table.clear();
  }

  updateTable() {
    this.isLoading = true;
    this.rowData = [];
    this.paginationParams = { pageNum: 1, pageSize: 20, totalCount: 0 };
    this.getAll(this.paginationParams).subscribe(data => {
      this.rowData = data.items;
      this.paginationParams.totalPage = ceil(data.totalCount / this.maxResultCount);
      this.paginationParams.totalCount = data.totalCount;
      this.isLoading = false;
    });
  }


}

