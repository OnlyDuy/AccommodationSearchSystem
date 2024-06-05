import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeUserComponent } from './home-user.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: HomeUserComponent,
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class HomeUserRoutingModule { }
