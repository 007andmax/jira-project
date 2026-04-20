import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SuperAdminKnowledgeBaseRoutingModule } from './super-admin-knowledge-base-routing.module';
import { SuperAdminKnowledgeBaseTableItemComponent } from './super-admin-knowledge-base-table/super-admin-knowledge-base-table-item/super-admin-knowledge-base-table-item.component';
import { SuperAdminKnowledgeBaseTableComponent } from './super-admin-knowledge-base-table/super-admin-knowledge-base-table.component';
import { SuperAdminKnowledgeBaseComponent } from './super-admin-knowledge-base.component';
import { SuperAdminKnowledgeBaseAddComponent } from './super-admin-knowledge-base-add/super-admin-knowledge-base-add.component';
import { AngularEditorModule } from '@kolkov/angular-editor';


import { FormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SuperAdminKnowledgeBaseNewsComponent } from './super-admin-knowledge-base-news/super-admin-knowledge-base-news.component';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { SuperAdminKnowledgeBaseEditComponent } from './super-admin-knowledge-base-edit/super-admin-knowledge-base-edit.component';
import { SuperAdminKnowledgeBaseNewsListComponent } from './super-admin-knowledge-base-news-list/super-admin-knowledge-base-news-list.component';









@NgModule({
    declarations: [SuperAdminKnowledgeBaseComponent,
        SuperAdminKnowledgeBaseTableComponent,
        SuperAdminKnowledgeBaseTableItemComponent,
        SuperAdminKnowledgeBaseAddComponent,
        SuperAdminKnowledgeBaseEditComponent,
        SuperAdminKnowledgeBaseNewsListComponent
    ],
    imports: [
    CommonModule,
    NgbModule,
    SuperAdminKnowledgeBaseRoutingModule,
    AngularEditorModule,
    FormsModule,
    InfiniteScrollModule,
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot()
],

})
export class SuperAdminKnowledgeBaseModule { }
