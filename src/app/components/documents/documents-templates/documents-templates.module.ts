import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentsTemplatesComponent } from './documents-templates.component';
import { DocumentsTemplatesHeaderComponent } from './documents-templates-header/documents-templates-header.component';
import { DocumentsTemplatesItemComponent } from './documents-templates-item/documents-templates-item.component';

import { FormsModule } from '@angular/forms';
import { DocumentsTemplatesFilterComponent } from './documents-templates-header/documents-templates-filter/documents-templates-filter.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { DocumentsTemplatesRoutingModule } from './documents-templates-routing.module';


@NgModule({
    imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    DocumentsTemplatesRoutingModule,
    DocumentsTemplatesComponent,
    DocumentsTemplatesHeaderComponent,
    DocumentsTemplatesItemComponent,
    DocumentsTemplatesFilterComponent
],
})
export class DocumentsTemplatesModule { }
