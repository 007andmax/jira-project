import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractsAsideBlockTimeBillingUsersComponent } from './contracts-aside-block-time-billing-users.component';
import { MatChipModule } from 'src/app/components/shared/mat-chip/mat-chip.module';
import { MatChipListModule } from 'src/app/components/shared/mat-chip-list/mat-chip-list.module';
import { TicketsTableItemRequestedByModule } from 'src/app/components/tickets/tickets/tickets-table/tickets-table-item/tickets-table-item-requested-by/tickets-table-item-requested-by.module';
import { UserLogoPopoverModule } from 'src/app/directives/user-logo-popover/user-logo-popover.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';




@NgModule({
    declarations: [ContractsAsideBlockTimeBillingUsersComponent
    ],
    imports: [
        CommonModule,
        MatChipModule,
        MatChipListModule,
        TicketsTableItemRequestedByModule,
        UserLogoPopoverModule,
        NgbModule

    ],
    exports: [ContractsAsideBlockTimeBillingUsersComponent]


})
export class ContractsAsideBlockTimeBillingUsersModule { }
