import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentsEditComponent } from './documents-edit.component';

import { DocumentsAddBodyModule } from '../documents-add/documents-add-body/documents-add-body.module';

import { DocumentsEditInfoComponent } from './documents-edit-info/documents-edit-info.component';
import { FormsModule } from '@angular/forms';





import { DocumentsEditHistoryComponent } from './documents-edit-history/documents-edit-history.component';

import { DocumentsEditRoutingModule } from './documents-edit-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
    imports: [
        CommonModule,
        DocumentsAddHeaderModule,
        DocumentsAddBodyModule,
        DocumentsAddFooterModule,
        FormsModule,
        TextAreaModule,
        DropDownModule,
        DocumentsLinkedModule,
        CompanyTagsModule,
        DatePickerModule,
        DocumentsAddEditCategoriesModule,
        DocumentsEditRoutingModule,
        NgbModule,
        MatErrorModule,
        TicketsTableItemRequestedByModule,
        UserLogoPopoverModule,
    ],



})
export class DocumentsEditModule { }
