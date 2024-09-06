import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceRegularNoteComponent } from './invoice-regular-note.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InvoiceSelectNoteComponent } from '../invoice-select-note/invoice-select-note.component';
import { InvoiceAddNoteComponent } from '../invoice-add-note/invoice-add-note.component';
import { FormsModule } from '@angular/forms';
import { MatSelectModule, MatChipsModule } from '@angular/material';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';


@NgModule({
    declarations: [InvoiceRegularNoteComponent,
        InvoiceSelectNoteComponent,
        InvoiceAddNoteComponent
    ],
    imports: [
        CommonModule,
        NgbModule,
        FormsModule,
        MatSelectModule,
        MatChipsModule,
        MatErrorModule
    ],
    exports: [InvoiceRegularNoteComponent]



})
export class InvoiceRegularNoteModule { }
