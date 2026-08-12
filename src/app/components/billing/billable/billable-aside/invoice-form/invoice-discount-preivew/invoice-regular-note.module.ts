import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InvoiceSelectNoteComponent } from '../invoice-select-note/invoice-select-note.component';
import { InvoiceAddNoteComponent } from '../invoice-add-note/invoice-add-note.component';
import { FormsModule } from '@angular/forms';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';
import { InvoiceDiscountPreivewComponent } from './invoice-discount-preivew.component';


@NgModule({
    declarations: [InvoiceDiscountPreivewComponent
    ],
    imports: [
        CommonModule,
        NgbModule,
        FormsModule,
        MatErrorModule
    ],
    exports: [InvoiceDiscountPreivewComponent]



})
export class InvoiceDiscountPreivewModule { }
