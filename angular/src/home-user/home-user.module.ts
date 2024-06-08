import { HomeUserRoutingModule } from './home-user-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeUserComponent } from './home-user.component';
import { HeaderHomeUserComponent } from './header-home-user/header-home-user.component';
import { SliderHomeUserComponent } from './slider-home-user/slider-home-user.component';
import { FooterHomeUserComponent } from './footer-home-user/footer-home-user.component';

@NgModule({
  imports: [
    CommonModule,
    HomeUserRoutingModule
  ],
  declarations: [HomeUserComponent, HeaderHomeUserComponent, SliderHomeUserComponent, FooterHomeUserComponent]
})
export class HomeUserModule { }
