import { HomeUserRoutingModule } from "./home-user-routing.module";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from "@angular/common";
import { HomeUserComponent } from "./home-user.component";
import { HeaderHomeUserComponent } from "./header-home-user/header-home-user.component";
import { SliderHomeUserComponent } from "./slider-home-user/slider-home-user.component";
import { FooterHomeUserComponent } from "./footer-home-user/footer-home-user.component";
import { SharedModule } from "@shared/shared.module";
import { HomeUserPostsDetailComponent } from "./home-user-posts-detail/home-user-posts-detail.component";
import { HttpClientJsonpModule, HttpClientModule } from "@angular/common/http";
import { ServiceProxyModule } from "@shared/service-proxies/service-proxy.module";
import { HomeUserPostsComponent } from "./home-user-posts/home-user-posts.component";
import { HomeViewPostsComponent } from "./home-view-posts/home-view-posts.component";
import { HomeUserContactComponent } from "./home-user-contact/home-user-contact.component";
import { TabsModule } from "ngx-bootstrap/tabs";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ModalModule } from "ngx-bootstrap/modal";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { CollapseModule } from "ngx-bootstrap/collapse";
import { NgxPaginationModule } from "ngx-pagination";
import { HomeUserAboutUsComponent } from './home-user-about-us/home-user-about-us.component';
import { HomeUserLikeComponent } from './home-user-like/home-user-like.component';

@NgModule({
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
    ServiceProxyModule,
    SharedModule,
    NgxPaginationModule,
    HomeUserRoutingModule,
  ],
  declarations: [
    HomeUserComponent,
    HeaderHomeUserComponent,
    SliderHomeUserComponent,
    FooterHomeUserComponent,
    HomeUserPostsDetailComponent,
    HomeUserPostsComponent,
    HomeViewPostsComponent,
    HomeUserContactComponent,
    HomeUserAboutUsComponent,
    HomeUserLikeComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeUserModule {}
