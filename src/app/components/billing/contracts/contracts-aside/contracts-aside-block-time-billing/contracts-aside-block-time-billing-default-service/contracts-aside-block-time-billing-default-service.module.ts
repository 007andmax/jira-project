import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractsAsideBlockTimeBillingDefaultServiceComponent } from './contracts-aside-block-time-billing-default-service.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InvoiceFormTicketEditTaxesModule } from 'src/app/components/billing/billable/billable-aside/invoice-form/invoice-form-ticket-edit/invoice-form-ticket-edit-taxes/invoice-form-ticket-edit-taxes.module';
import { NumberModule } from 'src/app/directives/number/number.module';
import { TaxesModule } from 'src/app/components/shared/taxes/taxes.module';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';
import { DecimalNumberModule } from 'src/app/directives/decimal-number/decimal-number.module';
import { ContractsAsideDiscountModule } from '../../contracts-aside-discount/contracts-aside-discount.module';



@NgModule({
    declarations: [
        ContractsAsideBlockTimeBillingDefaultServiceComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        TaxesModule,
        NumberModule,
        MatErrorModule,
        DecimalNumberModule,
        ContractsAsideDiscountModule
    ],
    exports: [ContractsAsideBlockTimeBillingDefaultServiceComponent]



})
export class ContractsAsideBlockTimeBillingDefaultServiceModule { }
