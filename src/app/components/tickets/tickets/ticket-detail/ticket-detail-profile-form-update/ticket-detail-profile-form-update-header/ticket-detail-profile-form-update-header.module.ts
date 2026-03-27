import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddAssignedUserNoteModule } from './add-assigned-user-note/add-assigned-user-note.module';
import { TicketDetailProfileFormUpdateHeaderComponent } from './ticket-detail-profile-form-update-header.component';
import { UserLogoPopoverModule } from 'src/app/directives/user-logo-popover/user-logo-popover.module';
import { TicketsTableItemRequestedByModule } from '../../../tickets-table/tickets-table-item/tickets-table-item-requested-by/tickets-table-item-requested-by.module';

@NgModule({
    declarations: [
        TicketDetailProfileFormUpdateHeaderComponent
    ],
    imports: [
        CommonModule,
        NgbModule,
        FormsModule,
        AddAssignedUserNoteModule,
        UserLogoPopoverModule,
        TicketsTableItemRequestedByModule,
    ],
    exports: [TicketDetailProfileFormUpdateHeaderComponent],

})
export class TicketDetailProfileFormUpdateHeaderModule { }
