import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyDocumentsComponent } from './company-documents.component';

import { CompanyDocumentsTableComponent } from './company-documents-table/company-documents-table.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CompanyDocumentsRoutingModule } from './company-documents-routing.module';

@NgModule({
    imports: [
    CommonModule,
    NgbModule,
    CompanyDocumentsRoutingModule,
    CompanyDocumentsComponent,
    CompanyDocumentsTableComponent
],
})
export class CompanyDocumentsModule { }
