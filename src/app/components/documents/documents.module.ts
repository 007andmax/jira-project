import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentsComponent } from './documents.component';
import { DocumentsHeaderModule } from './documents-header/documents-header.module';
import { DocumentsTableComponent } from './documents-table/documents-table.component';
import { DocumentsTableModule } from './documents-table/documents-table.module';
import { DocumentsTemplatesInfoModule } from './documents-templates/documents-templates-info/documents-templates-info.module';
import { DocumentsRoutingModule } from './documents-routing.module';
import { DocumentsEditCategoryComponent } from './documents-edit-category/documents-edit-category.component';
import { DocumentsEditCategoryItemComponent } from './documents-edit-category/documents-edit-category-item/documents-edit-category-item.component';
import { FormsModule } from '@angular/forms';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { PreloaderTicketModule } from '../shared/preloader-ticket/preloader-ticket.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DocumentsFilterModule } from './documents-header/documents-filter/documents-filter.module';

@NgModule({
    declarations: [DocumentsComponent,
        DocumentsEditCategoryComponent,
        DocumentsEditCategoryItemComponent

    ],
    imports: [
        CommonModule,
        DocumentsHeaderModule,
        DocumentsTableModule,
        DocumentsTemplatesInfoModule,
        DocumentsRoutingModule,
        FormsModule,
        DisabledBtnModule,
        PreloaderTicketModule,
        NgbModule,
        DocumentsFilterModule

    ],
})
export class DocumentsModule { }
