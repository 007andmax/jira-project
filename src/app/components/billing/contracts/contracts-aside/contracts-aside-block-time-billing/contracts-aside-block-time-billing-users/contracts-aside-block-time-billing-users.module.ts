import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractsAsideBlockTimeBillingUsersComponent } from './contracts-aside-block-time-billing-users.component';
import { MatChipModule } from 'src/app/components/shared/mat-chip/mat-chip.module';
import { MatChipListModule } from 'src/app/components/shared/mat-chip-list/mat-chip-list.module';




@NgModule({
    declarations: [ContractsAsideBlockTimeBillingUsersComponent
    ],
    imports: [
        CommonModule,
        MatChipModule,
        MatChipListModule

    ],
    exports: [ContractsAsideBlockTimeBillingUsersComponent]


})
export class ContractsAsideBlockTimeBillingUsersModule { }
