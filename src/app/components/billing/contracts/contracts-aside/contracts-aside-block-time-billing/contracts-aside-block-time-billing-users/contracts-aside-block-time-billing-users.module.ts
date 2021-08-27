import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractsAsideBlockTimeBillingUsersComponent } from './contracts-aside-block-time-billing-users.component';
import { MatChipsModule, MatIconModule, MatSelectModule } from '@angular/material';



@NgModule({
    declarations: [ContractsAsideBlockTimeBillingUsersComponent
    ],
    imports: [
        CommonModule,
        MatSelectModule,
        MatChipsModule,
        MatIconModule

    ],
    exports: [ContractsAsideBlockTimeBillingUsersComponent]


})
export class ContractsAsideBlockTimeBillingUsersModule { }
