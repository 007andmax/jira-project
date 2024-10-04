import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractsAsideBlockTimeBillingCustomerServiceComponent } from './contracts-aside-block-time-billing-customer-service.component';
import { FormsModule } from '@angular/forms';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';


@NgModule({
    declarations: [ContractsAsideBlockTimeBillingCustomerServiceComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        MatErrorModule
    ],
    exports: [ContractsAsideBlockTimeBillingCustomerServiceComponent]


})
export class ContractsAsideBlockTimeBillingCustomerServiceModule { }
