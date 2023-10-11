import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SuperAdminCompaniesComponent } from './super-admin-companies.component';
import { SuperAdminCompaniesHeaderComponent } from './super-admin-companies-header/super-admin-companies-header.component';
import { SuperAdminCompaniesItemComponent } from './super-admin-companies-item/super-admin-companies-item.component';
import { SuperAdminCompaniesRoutingModule } from './super-admin-companies-routing.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';




@NgModule({
    declarations: [SuperAdminCompaniesComponent,
        SuperAdminCompaniesHeaderComponent,
        SuperAdminCompaniesItemComponent
    ],
    imports: [
        CommonModule,
        NgbModule,
        SuperAdminCompaniesRoutingModule,
        InfiniteScrollModule,
    ],
    exports: [SuperAdminCompaniesComponent]
})
export class SuperAdminCompaniesModule { }
