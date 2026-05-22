import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TicketsTableItemComponent } from './tickets-table-item.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { AddAssignedUserModule } from '../../ticket-edit-aside/add-assigned-user/add-assigned-user.module';
import { MatChipModule } from 'src/app/components/shared/mat-chip/mat-chip.module';
import { TicketsTableItemAssignedUserComponent } from './tickets-table-item-assigned-user/tickets-table-item-assigned-user.component';
import { TicketsTableItemStatusComponent } from './tickets-table-item-status/tickets-table-item-status.component';
import { TicketsTableItemRequestedByComponent } from './tickets-table-item-requested-by/tickets-table-item-requested-by.component';
import { NgxMaskModule } from 'ngx-mask';
import { TicketsTableItemRequestedByModule } from './tickets-table-item-requested-by/tickets-table-item-requested-by.module';
import { UserLogoPopoverModule } from 'src/app/directives/user-logo-popover/user-logo-popover.module';
import { TicketsTableItemAssignedUserItemComponent } from './tickets-table-item-assigned-user/tickets-table-item-assigned-user-item/tickets-table-item-assigned-user-item.component';
import { TicketsTableItemAssignedUserMoreItemComponent } from './tickets-table-item-assigned-user/tickets-table-item-assigned-user-more-item/tickets-table-item-assigned-user-more-item.component';
import { CompanyLogoPopoverModule } from 'src/app/directives/company-logo-popover/company-logo-popover.module';
import { UsersTableCompanyByModule } from 'src/app/components/users/users-table/users-table-company-by/users-table-company-by.module';
import { TicketsTableItemStatusModule } from './tickets-table-item-status/tickets-table-item-status.module';

@NgModule({
    declarations: [TicketsTableItemComponent, TicketsTableItemAssignedUserComponent, TicketsTableItemAssignedUserItemComponent, TicketsTableItemAssignedUserMoreItemComponent
    ],
    imports: [
        CommonModule,
        NgbModule,
        FormsModule,
        AddAssignedUserModule,
        MatChipModule,
        NgxMaskModule.forRoot(),
        TicketsTableItemRequestedByModule,
        UserLogoPopoverModule,
        CompanyLogoPopoverModule,
        UsersTableCompanyByModule,
        TicketsTableItemStatusModule,
    ],
    exports: [TicketsTableItemComponent]


})
export class TicketsTableItemModule { }
