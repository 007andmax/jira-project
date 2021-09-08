import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentsAddComponent } from './documents-add.component';
import { DocumentsAddHeaderModule } from './documents-add-header/documents-add-header.module';
import { DocumentsAddBodyModule } from './documents-add-body/documents-add-body.module';
import { DocumentsAddFooterModule } from './documents-add-footer/documents-add-footer.module';
import { DocumentsAddInfoComponent } from './documents-add-info/documents-add-info.component';
import { MatSelectModule, MatChipsModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { TextAreaModule } from 'src/app/directives/text-area/text-area.module';
import { DropDownModule } from '../../shared/drop-down/drop-down.module';
import { DocumentsLinkedModule } from './documents-add-info/documents-linked/documents-linked.module';
import { CompanyTagsModule } from '../../companies/company-tags/company-tags.module';
import { DatePickerModule } from '../../shared/date-picker/date-picker.module';
import { DocumentsAddEditCategoriesModule } from './documents-add-info/documents-add-edit-categories/documents-add-edit-categories.module';
import { DocumentsAddRoutingModule } from './documents-add-routing.module';


@NgModule({
    declarations: [DocumentsAddComponent,
        DocumentsAddInfoComponent

    ],
    imports: [
        CommonModule,
        DocumentsAddHeaderModule,
        DocumentsAddBodyModule,
        DocumentsAddFooterModule,
        MatSelectModule,
        MatChipsModule,
        FormsModule,
        TextAreaModule,
        DropDownModule,
        DocumentsLinkedModule,
        CompanyTagsModule,
        DatePickerModule,
        DocumentsAddEditCategoriesModule,
        DocumentsAddRoutingModule
    ],



})
export class DocumentsAddModule { }
