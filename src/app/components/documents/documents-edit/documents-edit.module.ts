import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentsEditComponent } from './documents-edit.component';
import { DocumentsAddHeaderModule } from '../documents-add/documents-add-header/documents-add-header.module';
import { DocumentsAddBodyModule } from '../documents-add/documents-add-body/documents-add-body.module';
import { DocumentsAddFooterModule } from '../documents-add/documents-add-footer/documents-add-footer.module';
import { DocumentsEditInfoComponent } from './documents-edit-info/documents-edit-info.component';
import { MatSelectModule, MatChipsModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { TextAreaModule } from 'src/app/directives/text-area/text-area.module';
import { DropDownModule } from '../../shared/drop-down/drop-down.module';
import { DocumentsLinkedModule } from '../documents-add/documents-add-info/documents-linked/documents-linked.module';
import { CompanyTagsModule } from '../../companies/company-tags/company-tags.module';
import { DatePickerModule } from '../../shared/date-picker/date-picker.module';
import { DocumentsEditHistoryComponent } from './documents-edit-history/documents-edit-history.component';
import { DocumentsAddEditCategoriesModule } from '../documents-add/documents-add-info/documents-add-edit-categories/documents-add-edit-categories.module';
import { DocumentsEditRoutingModule } from './documents-edit-routing.module';


@NgModule({
    declarations: [DocumentsEditComponent,
        DocumentsEditInfoComponent,
        DocumentsEditHistoryComponent

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
        DocumentsEditRoutingModule
    ],



})
export class DocumentsEditModule { }
