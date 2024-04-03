
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientJsonpModule } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgxPaginationModule } from 'ngx-pagination';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceProxyModule } from '@shared/service-proxies/service-proxy.module';
import { SharedModule } from '@shared/shared.module';
import { HomeComponent } from '@app/home/home.component';
import { AboutComponent } from '@app/about/about.component';
// tenants
import { TenantsComponent } from '@app/tenants/tenants.component';
import { CreateTenantDialogComponent } from './tenants/create-tenant/create-tenant-dialog.component';
import { EditTenantDialogComponent } from './tenants/edit-tenant/edit-tenant-dialog.component';
// roles
import { RolesComponent } from '@app/roles/roles.component';
import { CreateRoleDialogComponent } from './roles/create-role/create-role-dialog.component';
import { EditRoleDialogComponent } from './roles/edit-role/edit-role-dialog.component';
// users
import { UsersComponent } from '@app/users/users.component';
import { CreateUserDialogComponent } from '@app/users/create-user/create-user-dialog.component';
import { EditUserDialogComponent } from '@app/users/edit-user/edit-user-dialog.component';
import { ChangePasswordComponent } from './users/change-password/change-password.component';
import { ResetPasswordDialogComponent } from './users/reset-password/reset-password.component';
// infor user
import { InforUserComponent } from './infor-user/infor-user.component';
import { EditInforUserComponent } from './infor-user/edit-infor-user/edit-infor-user.component';
import { DetailUserComponent} from "./infor-user/detail-user/detail-user.component";
import {ResetPasswordInforComponent} from "./infor-user/reset-password-infor/reset-password-infor.component";

// layout
import { HeaderComponent } from './layout/header.component';
import { HeaderLeftNavbarComponent } from './layout/header-left-navbar.component';
import { HeaderLanguageMenuComponent } from './layout/header-language-menu.component';
import { HeaderUserMenuComponent } from './layout/header-user-menu.component';
import { FooterComponent } from './layout/footer.component';
import { SidebarComponent } from './layout/sidebar.component';
import { SidebarLogoComponent } from './layout/sidebar-logo.component';
import { SidebarUserPanelComponent } from './layout/sidebar-user-panel.component';
import { SidebarMenuComponent } from './layout/sidebar-menu.component';
import { PostComponent } from './post/post.component';
import { CreateOrEditPostComponent } from './post/create-or-edit-post/create-or-edit-post.component';
import { PostDetailComponent } from './post/post-detail/post-detail.component';
import { PostViewComponent } from './post/post-view/post-view.component';
import { PostViewDetailComponent } from './post/post-view-detail/post-view-detail.component';
import { AppScheduleComponent } from './app-schedule/app-schedule.component';
import { AppScheduleSuccessComponent } from './app-schedule/app-schedule-success/app-schedule-success.component';
import { AppScheduleWaitComponent } from './app-schedule/app-schedule-wait/app-schedule-wait.component';
import { FormDatePipe } from './_forms/form-date.pipe';
import { AppScheduleWaitUpdateComponent } from './app-schedule/app-schedule-wait/app-schedule-wait-update/app-schedule-wait-update.component';
import { PostAdminViewComponent } from './post/post-admin-view/post-admin-view.component';
import { AppScheduleWaitViewPostComponent } from './app-schedule/app-schedule-wait/app-schedule-wait-view-post/app-schedule-wait-view-post.component';
import { AppPackagePostsComponent } from './app-package-posts/app-package-posts.component';
import { AppPackagePostsVipProComponent } from './app-package-posts/app-package-posts-vip-pro/app-package-posts-vip-pro.component';
import { AppPackagePostsVipComponent } from './app-package-posts/app-package-posts-vip/app-package-posts-vip.component';
import { AppPackagePostsEditComponent } from './app-package-posts/app-package-posts-edit/app-package-posts-edit.component';
import { PostViewLikeComponent } from './post/post-view-like/post-view-like.component';
import { StatisticalComponent } from './statistical/statistical.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    // tenants
    TenantsComponent,
    CreateTenantDialogComponent,
    EditTenantDialogComponent,
    // roles
    RolesComponent,
    CreateRoleDialogComponent,
    EditRoleDialogComponent,
    // users
    UsersComponent,
    CreateUserDialogComponent,
    EditUserDialogComponent,
    ChangePasswordComponent,
    ResetPasswordDialogComponent,
    // infor user
    InforUserComponent,
    ResetPasswordInforComponent,
    DetailUserComponent,
    EditInforUserComponent,
    // layout
    HeaderComponent,
    HeaderLeftNavbarComponent,
    HeaderLanguageMenuComponent,
    HeaderUserMenuComponent,
    FooterComponent,
    SidebarComponent,
    SidebarLogoComponent,
    SidebarUserPanelComponent,
    SidebarMenuComponent,

    // posts
    PostComponent,
    CreateOrEditPostComponent,
    PostDetailComponent,
    PostViewComponent,
    PostViewDetailComponent,
    AppScheduleComponent,
    AppScheduleSuccessComponent,
    AppScheduleWaitComponent,
    FormDatePipe,

    // schedule
    AppScheduleWaitUpdateComponent,
    PostAdminViewComponent,
    AppScheduleWaitViewPostComponent,

    // package
    AppPackagePostsComponent,
    AppPackagePostsVipProComponent,
    AppPackagePostsVipComponent,
    AppPackagePostsEditComponent,
    PostViewLikeComponent,

    // statistics
    StatisticalComponent
   ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    ModalModule.forChild(),
    BsDropdownModule,
    CollapseModule,
    TabsModule,
    AppRoutingModule,
    ServiceProxyModule,
    SharedModule,
    NgxPaginationModule,
  ],
  providers: [],
  entryComponents: [
    // tenants
    CreateTenantDialogComponent,
    EditTenantDialogComponent,
    // roles
    CreateRoleDialogComponent,
    EditRoleDialogComponent,
    // users
    CreateUserDialogComponent,
    EditUserDialogComponent,
    ResetPasswordDialogComponent,
    CreateOrEditPostComponent,
    PostAdminViewComponent
  ],
})
export class AppModule {}
