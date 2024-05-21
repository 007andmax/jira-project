import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SuperAdminPublicListComponent } from './super-admin-public-list.component';
import { SuperAdminKnowledgeBaseNewsModule } from '../../super-admin/super-admin-knowledge-base/super-admin-knowledge-base-news/super-admin-knowledge-base-news.module';


@NgModule({
    declarations: [
        SuperAdminPublicListComponent
    ],
    imports: [
        CommonModule,
        NgbModule,
        InfiniteScrollModule,
        SuperAdminKnowledgeBaseNewsModule
    ],
    exports: [SuperAdminPublicListComponent]
})
export class SuperAdminPublicListModule { }
