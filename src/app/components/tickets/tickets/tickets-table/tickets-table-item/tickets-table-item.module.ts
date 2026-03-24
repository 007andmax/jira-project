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

@NgModule({
    declarations: [TicketsTableItemComponent, TicketsTableItemAssignedUserComponent, TicketsTableItemStatusComponent
    ],
    imports: [
        CommonModule,
        NgbModule,
        FormsModule,
        AddAssignedUserModule,
        MatChipModule,
        NgxMaskModule.forRoot(),
        TicketsTableItemRequestedByModule
    ],
    exports: [TicketsTableItemComponent]


})
export class TicketsTableItemModule { }
