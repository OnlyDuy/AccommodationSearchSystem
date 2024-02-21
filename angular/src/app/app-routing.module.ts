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

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: AppComponent,
                children: [
                    { path: 'home', component: HomeComponent,  canActivate: [AppRouteGuard] },

                    // {path: 'create-post', component: CreatePostComponent, data: { permission: 'Pages.Posts' }, canActivate: [AppRouteGuard] },
                    {path: 'post', component: PostComponent, data: { permission: 'Pages.Posts' }, canActivate: [AppRouteGuard] },

                    { path: 'infor-user', component: InforUserComponent, data: { permission: 'Pages.Personal.Information' },  canActivate: [AppRouteGuard] },
                    // { path: 'edit-user', component: EditUserComponent, data: { permission: 'Pages.Personal.Information' }, canActivate: [AppRouteGuard] },

                    { path: 'users', component: UsersComponent, data: { permission: 'Pages.Users' }, canActivate: [AppRouteGuard] },
                    { path: 'roles', component: RolesComponent, data: { permission: 'Pages.Roles' }, canActivate: [AppRouteGuard] },
                    { path: 'tenants', component: TenantsComponent, data: { permission: 'Pages.Tenants' }, canActivate: [AppRouteGuard] },
                    { path: 'about', component: AboutComponent, canActivate: [AppRouteGuard] },
                    { path: 'update-password', component: ChangePasswordComponent, data: { permission: 'Pages.Users' }, canActivate: [AppRouteGuard] }
                ]
            }
        ])
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
