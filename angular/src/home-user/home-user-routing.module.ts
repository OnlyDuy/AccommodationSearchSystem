import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeUserComponent } from './home-user.component';
import { HomeUserPostsDetailComponent } from './home-user-posts-detail/home-user-posts-detail.component';
import { HomeUserPostsComponent } from './home-user-posts/home-user-posts.component';
import { HomeViewPostsComponent } from './home-view-posts/home-view-posts.component';
import { HomeUserContactComponent } from './home-user-contact/home-user-contact.component';
import { HomeUserAboutUsComponent } from './home-user-about-us/home-user-about-us.component';
import { HomeUserLikeComponent } from './home-user-like/home-user-like.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: HomeUserComponent,
                children: [
                    { path: '', component: HomeUserPostsComponent },  // Trang chủ home
                    { path: 'home-user-posts-detail/:id', component: HomeUserPostsDetailComponent},

                    { path: 'home-view-posts', component: HomeViewPostsComponent},
                    { path: 'home-view-posts/home-user-posts-detail/:id', component: HomeUserPostsDetailComponent},
                    { path: 'home-user-contact', component: HomeUserContactComponent},
                    { path: 'home-user-like', component: HomeUserLikeComponent},
                    { path: 'home-user-about-us', component: HomeUserAboutUsComponent},
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class HomeUserRoutingModule { }
