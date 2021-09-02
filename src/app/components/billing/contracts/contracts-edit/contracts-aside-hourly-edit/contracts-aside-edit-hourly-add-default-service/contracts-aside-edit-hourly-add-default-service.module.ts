import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractsAsideEditHourlyAddDefaultServiceComponent } from './contracts-aside-edit-hourly-add-default-service.component';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { MatSelectModule, MatChipsModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { InvoiceFormTicketEditTaxesModule } from 'src/app/components/billing/billable/billable-aside/invoice-form/invoice-form-ticket-edit/invoice-form-ticket-edit-taxes/invoice-form-ticket-edit-taxes.module';
import { NumberModule } from 'src/app/directives/number/number.module';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';


@NgModule({
    declarations: [ContractsAsideEditHourlyAddDefaultServiceComponent

    ],
    imports: [
        CommonModule,
        DropDownModule,
        MatSelectModule,
        MatChipsModule,
        FormsModule,
        InvoiceFormTicketEditTaxesModule,
        NumberModule,
        DisabledBtnModule
    ],
    exports: [ContractsAsideEditHourlyAddDefaultServiceComponent]



})
export class ContractsAsideEditHourlyAddDefaultServiceModule { }
