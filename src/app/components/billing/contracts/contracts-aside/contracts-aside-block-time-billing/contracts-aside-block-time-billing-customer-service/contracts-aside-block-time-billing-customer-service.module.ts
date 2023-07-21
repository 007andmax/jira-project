import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractsAsideBlockTimeBillingCustomerServiceComponent } from './contracts-aside-block-time-billing-customer-service.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';


@NgModule({
    declarations: [ContractsAsideBlockTimeBillingCustomerServiceComponent
    ],
    imports: [
        CommonModule,
        MatSelectModule,
        MatChipsModule,
        FormsModule,

    ],
    exports: [ContractsAsideBlockTimeBillingCustomerServiceComponent]


})
export class ContractsAsideBlockTimeBillingCustomerServiceModule { }
