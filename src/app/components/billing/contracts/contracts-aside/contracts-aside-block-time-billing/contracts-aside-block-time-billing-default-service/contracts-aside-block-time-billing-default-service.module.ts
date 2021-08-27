import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractsAsideBlockTimeBillingDefaultServiceComponent } from './contracts-aside-block-time-billing-default-service.component';
import { MatChipsModule, MatSelectModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InvoiceFormTicketEditTaxesModule } from 'src/app/components/billing/billable/billable-aside/invoice-form/invoice-form-ticket-edit/invoice-form-ticket-edit-taxes/invoice-form-ticket-edit-taxes.module';
import { NumberModule } from 'src/app/directives/number/number.module';



@NgModule({
    declarations: [
        ContractsAsideBlockTimeBillingDefaultServiceComponent
    ],
    imports: [
        CommonModule,
        MatSelectModule,
        MatChipsModule,
        FormsModule,
        NgbModule,
        InvoiceFormTicketEditTaxesModule,
        NumberModule
    ],
    exports: [ContractsAsideBlockTimeBillingDefaultServiceComponent]



})
export class ContractsAsideBlockTimeBillingDefaultServiceModule { }
