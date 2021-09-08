import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentsComponent } from './documents.component';
import { DocumentsHeaderModule } from './documents-header/documents-header.module';
import { DocumentsTableComponent } from './documents-table/documents-table.component';
import { DocumentsTableModule } from './documents-table/documents-table.module';
import { DocumentsTemplatesInfoModule } from './documents-templates/documents-templates-info/documents-templates-info.module';
import { DocumentsRoutingModule } from './documents-routing.module';

@NgModule({
    declarations: [DocumentsComponent,

    ],
    imports: [
        CommonModule,
        DocumentsHeaderModule,
        DocumentsTableModule,
        DocumentsTemplatesInfoModule,
        DocumentsRoutingModule
    ],



})
export class DocumentsModule { }
