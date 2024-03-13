import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';

import { AppSessionService } from './session/app-session.service';
import { AppUrlService } from './nav/app-url.service';
import { AppAuthService } from './auth/app-auth.service';
import { AppRouteGuard } from './auth/auth-route-guard';
import { LocalizePipe } from '@shared/pipes/localize.pipe';

import { AbpPaginationControlsComponent } from './components/pagination/abp-pagination-controls.component';
import { AbpValidationSummaryComponent } from './components/validation/abp-validation.summary.component';
import { AbpModalHeaderComponent } from './components/modal/abp-modal-header.component';
import { AbpModalFooterComponent } from './components/modal/abp-modal-footer.component';
import { LayoutStoreService } from './layout/layout-store.service';

import { BusyDirective } from './directives/busy.directive';
import { EqualValidator } from './directives/equal-validator.directive';

import { ButtonModule } from 'primeng/button';
// import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { TableModule } from 'primeng/table';
import { OrderListModule } from 'primeng/orderlist';
import { PaginatorModule } from 'primeng/paginator';
import { DataViewModule } from 'primeng/dataview';
import { CardModule } from 'primeng/card';
import { CalendarModule } from 'primeng/calendar';

import { FileUploadModule } from 'ng2-file-upload';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        NgxPaginationModule,
        BsDatepickerModule.forRoot(),
        TimepickerModule.forRoot(),
        ButtonModule,
        FileUploadModule,
        TableModule,
        OrderListModule,
        DataViewModule,
        CardModule,
        PaginatorModule,
        CalendarModule
    ],

    declarations: [
        AbpPaginationControlsComponent,
        AbpValidationSummaryComponent,
        AbpModalHeaderComponent,
        AbpModalFooterComponent,
        LocalizePipe,
        BusyDirective,
        EqualValidator
    ],
    exports: [
        AbpPaginationControlsComponent,
        AbpValidationSummaryComponent,
        AbpModalHeaderComponent,
        AbpModalFooterComponent,
        LocalizePipe,
        BusyDirective,
        EqualValidator,
        FileUploadModule,
        ButtonModule,
        TableModule,
        BsDatepickerModule,
        TimepickerModule,
        OrderListModule,
        DataViewModule,
        CardModule,
        CalendarModule,
        NgxPaginationModule,
        PaginatorModule
    ]
})
export class SharedModule {
    static forRoot(): ModuleWithProviders<SharedModule> {
        return {
            ngModule: SharedModule,
            providers: [
                AppSessionService,
                AppUrlService,
                AppAuthService,
                AppRouteGuard,
                LayoutStoreService
            ]
        };
    }
}
