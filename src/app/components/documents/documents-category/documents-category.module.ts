import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentsCategoryComponent } from './documents-category.component';
import { DocumentsHeaderModule } from '../documents-header/documents-header.module';
import { DocumentsTableModule } from '../documents-table/documents-table.module';
import { DocumentsTemplatesInfoModule } from '../documents-templates/documents-templates-info/documents-templates-info.module';
import { DocumentsCategoryRoutingModule } from './documents-category-routing.module';



@NgModule({
    declarations: [DocumentsCategoryComponent

    ],
    imports: [
        CommonModule,
        DocumentsHeaderModule,
        DocumentsTableModule,
        DocumentsTemplatesInfoModule,
        DocumentsCategoryRoutingModule
    ],



})
export class DocumentsCategoryModule { }
