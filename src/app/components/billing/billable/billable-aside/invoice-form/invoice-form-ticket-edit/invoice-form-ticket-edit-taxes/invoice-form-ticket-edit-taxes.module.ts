import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InvoiceFormTicketEditTaxesComponent } from './invoice-form-ticket-edit-taxes.component';
@NgModule({
    declarations: [
        InvoiceFormTicketEditTaxesComponent
    ],
    imports: [
        CommonModule,

        FormsModule,
        NgbModule,
    ],
    exports: [InvoiceFormTicketEditTaxesComponent],


})
export class InvoiceFormTicketEditTaxesModule { }
