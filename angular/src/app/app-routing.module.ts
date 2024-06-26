import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AppRouteGuard } from '@shared/auth/auth-route-guard';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { UsersComponent } from './users/users.component';
import { TenantsComponent } from './tenants/tenants.component';
import { RolesComponent } from 'app/roles/roles.component';
import { ChangePasswordComponent } from './users/change-password/change-password.component';
import { InforUserComponent } from './infor-user/infor-user.component';
import { PostComponent } from './post/post.component';
import { PostDetailComponent } from './post/post-detail/post-detail.component';
import { PostViewComponent } from './post/post-view/post-view.component';
import { PostViewDetailComponent } from './post/post-view-detail/post-view-detail.component';
import { AppScheduleWaitComponent } from './app-schedule/app-schedule-wait/app-schedule-wait.component';
import { AppScheduleSuccessComponent } from './app-schedule/app-schedule-success/app-schedule-success.component';
import { AppPackagePostsComponent } from './app-package-posts/app-package-posts.component';
import { PostViewLikeComponent } from './post/post-view-like/post-view-like.component';
import { StatisticalComponent } from './statistical/statistical.component';
import { AppPackagePostsPaymentSuccessComponent } from './app-package-posts/app-package-posts-payment-success/app-package-posts-payment-success.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: AppComponent,
                children: [
                    { path: 'home', component: HomeComponent, data: { permission: 'Pages.Posts' },  canActivate: [AppRouteGuard] },
                    { path: 'home/:id', component: PostDetailComponent, data: { permission: 'Pages.Posts' },  canActivate: [AppRouteGuard] },

                    { path: 'statistical', component: StatisticalComponent, data: { permission: 'Pages.Statistical' },  canActivate: [AppRouteGuard] },

                    // {path: 'create-post', component: CreatePostComponent, data: { permission: 'Pages.Posts' }, canActivate: [AppRouteGuard] },
                    { path: 'post', component: PostComponent, data: { permission: 'Pages.Posts' }, canActivate: [AppRouteGuard] },
                    { path: 'post/post-view', component: PostViewComponent, data: { permission: 'Pages.View.Posts' }, canActivate: [AppRouteGuard] },
                    { path: 'post/post-view/:id', component: PostViewDetailComponent, data: { permission: 'Pages.View.Posts' },  canActivate: [AppRouteGuard] },
                    { path: 'post/post-view-like', component: PostViewLikeComponent, data: { permission: 'Pages.View.Posts' }, canActivate: [AppRouteGuard] },
                    { path: 'post/post-view-like/:id', component: PostViewDetailComponent, data: { permission: 'Pages.View.Posts' }, canActivate: [AppRouteGuard] },


                    { path: 'infor-user', component: InforUserComponent, data: { permission: 'Pages.Personal.Information' },  canActivate: [AppRouteGuard] },
                    // { path: 'edit-user', component: EditUserComponent, data: { permission: 'Pages.Personal.Information' }, canActivate: [AppRouteGuard] },

                    { path: 'users', component: UsersComponent, data: { permission: 'Pages.Users' }, canActivate: [AppRouteGuard] },
                    { path: 'roles', component: RolesComponent, data: { permission: 'Pages.Roles' }, canActivate: [AppRouteGuard] },
                    { path: 'tenants', component: TenantsComponent, data: { permission: 'Pages.Tenants' }, canActivate: [AppRouteGuard] },
                    { path: 'about', component: AboutComponent, canActivate: [AppRouteGuard] },
                    { path: 'update-password', component: ChangePasswordComponent, data: { permission: 'Pages.Users' }, canActivate: [AppRouteGuard] },

                    { path: 'app-schedule/app-schedule-wait', component: AppScheduleWaitComponent, data: { permission: 'Pages.Manage.Appointment.Schedules' },  canActivate: [AppRouteGuard] },
                    { path: 'app-schedule/app-schedule-success', component: AppScheduleSuccessComponent, data: { permission: 'Pages.Manage.Appointment.Schedules' },  canActivate: [AppRouteGuard] },

                    { path: 'app-package-posts', component: AppPackagePostsComponent, data: { permission: '' },  canActivate: [AppRouteGuard] },
                    { path: 'app-package-posts-payment-success', component: AppPackagePostsPaymentSuccessComponent, data: { permission: '' },  canActivate: [AppRouteGuard] },



                ]
            }
        ])
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
