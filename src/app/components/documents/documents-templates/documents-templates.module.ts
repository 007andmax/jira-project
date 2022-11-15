import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentsTemplatesComponent } from './documents-templates.component';
import { DocumentsTemplatesHeaderComponent } from './documents-templates-header/documents-templates-header.component';
import { DocumentsTemplatesItemComponent } from './documents-templates-item/documents-templates-item.component';
import { DocumentsTemplatesInfoModule } from './documents-templates-info/documents-templates-info.module';
import { FormsModule } from '@angular/forms';
import { DocumentsTemplatesFilterComponent } from './documents-templates-header/documents-templates-filter/documents-templates-filter.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DropDownModule } from '../../shared/drop-down/drop-down.module';
import { DocumentsTemplatesRoutingModule } from './documents-templates-routing.module';


@NgModule({
    declarations: [DocumentsTemplatesComponent,
        DocumentsTemplatesHeaderComponent,
        DocumentsTemplatesItemComponent,
        DocumentsTemplatesFilterComponent

    ],
    imports: [
        CommonModule,
        DocumentsTemplatesInfoModule,
        FormsModule,
        NgbModule,
        DropDownModule,
        DocumentsTemplatesRoutingModule
    ],



})
export class DocumentsTemplatesModule { }
