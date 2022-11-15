import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuperAdminPublicHeaderComponent } from './super-admin-public-header.component';
import { SuperAdminPublicSearchComponent } from '../super-admin-public-search/super-admin-public-search.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';


@NgModule({
    declarations: [
        SuperAdminPublicHeaderComponent,
        SuperAdminPublicSearchComponent
    ],
    imports: [
        CommonModule,
        NgbModule,
        InfiniteScrollModule
    ],
    exports: [SuperAdminPublicHeaderComponent]

})
export class SuperAdminPublicHeaderModule { }
