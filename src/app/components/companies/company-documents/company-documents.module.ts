import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyDocumentsComponent } from './company-documents.component';
import { DocumentsHeaderModule } from '../../documents/documents-header/documents-header.module';
import { CompanyDocumentsTableComponent } from './company-documents-table/company-documents-table.component';
import { DocumentsTemplatesInfoModule } from '../../documents/documents-templates/documents-templates-info/documents-templates-info.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CompanyDocumentsRoutingModule } from './company-documents-routing.module';

@NgModule({
    declarations: [CompanyDocumentsComponent,
        CompanyDocumentsTableComponent
    ],
    imports: [
        CommonModule,
        DocumentsHeaderModule,
        DocumentsTemplatesInfoModule,
        NgbModule,
        CompanyDocumentsRoutingModule

    ],



})
export class CompanyDocumentsModule { }
