import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractsAsideBlockTimeBillingCustomerServiceComponent } from './contracts-aside-block-time-billing-customer-service.component';
import { MatChipsModule, MatSelectModule } from '@angular/material';
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
