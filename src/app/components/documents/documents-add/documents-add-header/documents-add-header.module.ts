import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentsAddHeaderComponent } from './documents-add-header.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FindWithinDocumentComponent } from '../../documents-edit/find-within-document/find-within-document.component';



@NgModule({
    declarations: [DocumentsAddHeaderComponent,
        FindWithinDocumentComponent

    ],
    imports: [
        CommonModule,
        NgbModule,

    ],
    exports: [DocumentsAddHeaderComponent]


})
export class DocumentsAddHeaderModule { }
