import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SuperAdminKnowledgeBaseRoutingModule } from './super-admin-knowledge-base-routing.module';
import { SuperAdminKnowledgeBaseTableItemComponent } from './super-admin-knowledge-base-table/super-admin-knowledge-base-table-item/super-admin-knowledge-base-table-item.component';
import { SuperAdminKnowledgeBaseTableComponent } from './super-admin-knowledge-base-table/super-admin-knowledge-base-table.component';
import { SuperAdminKnowledgeBaseComponent } from './super-admin-knowledge-base.component';
import { SuperAdminKnowledgeBaseAddComponent } from './super-admin-knowledge-base-add/super-admin-knowledge-base-add.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { DatePickerModule } from '../../shared/date-picker/date-picker.module';
import { DropDownModule } from '../../shared/drop-down/drop-down.module';
import { FormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SuperAdminKnowledgeBaseNewsComponent } from './super-admin-knowledge-base-news/super-admin-knowledge-base-news.component';
import { MatFormFieldModule } from '@angular/material';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';




@NgModule({
    declarations: [SuperAdminKnowledgeBaseComponent,
        SuperAdminKnowledgeBaseTableComponent,
        SuperAdminKnowledgeBaseTableItemComponent,
        SuperAdminKnowledgeBaseAddComponent,
        SuperAdminKnowledgeBaseNewsComponent
    ],
    imports: [
        CommonModule,
        NgbModule,
        SuperAdminKnowledgeBaseRoutingModule,
        AngularEditorModule,
        DatePickerModule,
        DropDownModule,
        FormsModule,
        InfiniteScrollModule,
        MatFormFieldModule,
        FroalaEditorModule.forRoot(),
        FroalaViewModule.forRoot()

    ],

})
export class SuperAdminKnowledgeBaseModule { }
