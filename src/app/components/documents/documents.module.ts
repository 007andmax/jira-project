import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentsComponent } from './documents.component';

import { DocumentsTableComponent } from './documents-table/documents-table.component';


import { DocumentsRoutingModule } from './documents-routing.module';
import { DocumentsEditCategoryComponent } from './documents-edit-category/documents-edit-category.component';
import { DocumentsEditCategoryItemComponent } from './documents-edit-category/documents-edit-category-item/documents-edit-category-item.component';
import { FormsModule } from '@angular/forms';


import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    imports: [
    CommonModule,
    DocumentsRoutingModule,
    FormsModule,
    NgbModule,
    DocumentsComponent,
    DocumentsEditCategoryComponent,
    DocumentsEditCategoryItemComponent,
],
})
export class DocumentsModule { }
