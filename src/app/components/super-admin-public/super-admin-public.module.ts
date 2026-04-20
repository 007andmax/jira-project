import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuperAdminPublicComponent } from './super-admin-public.component';
import { SupperAdminPublicRoutingModule } from './super-admin-public-routing.module';
import { SuperAdminPublicDetailComponent } from './super-admin-public-detail/super-admin-public-detail.component';
import { SuperAdminPublicHeaderComponent } from './super-admin-public-header/super-admin-public-header.component';
import { SuperAdminPublicSearchComponent } from './super-admin-public-search/super-admin-public-search.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { SuperAdminPublicListComponent } from './super-admin-public-list/super-admin-public-list.component';




@NgModule({
    imports: [
    CommonModule,
    SupperAdminPublicRoutingModule,
    NgbModule,
    InfiniteScrollModule,
    SuperAdminPublicComponent
],
})
export class SupperAdminPublicModule { }
