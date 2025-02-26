import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InvoiceFormTicketEditTaxesModule } from 'src/app/components/billing/billable/billable-aside/invoice-form/invoice-form-ticket-edit/invoice-form-ticket-edit-taxes/invoice-form-ticket-edit-taxes.module';
import { NumberModule } from 'src/app/directives/number/number.module';
import { TaxesModule } from 'src/app/components/shared/taxes/taxes.module';
import { DecimalNumberModule } from 'src/app/directives/decimal-number/decimal-number.module';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';
import { ContractsAsideDiscountComponent } from './contracts-aside-discount.component';



@NgModule({
    declarations: [ContractsAsideDiscountComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        NumberModule,
        DecimalNumberModule,
        MatErrorModule
    ],
    exports: [ContractsAsideDiscountComponent]
})
export class ContractsAsideDiscountModule { }
