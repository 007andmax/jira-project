import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractsAsideBlockTimeBillingUsersComponent } from './contracts-aside-block-time-billing-users.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';



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
