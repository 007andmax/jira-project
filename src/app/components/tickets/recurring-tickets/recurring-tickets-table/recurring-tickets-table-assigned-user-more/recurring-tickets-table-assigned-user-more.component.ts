import { Component, OnInit } from '@angular/core';
import { TicketsListService } from '../../../tickets/services/tickets-list.service';
import { RecurringTicketsTableAssignedUserComponent } from '../recurring-tickets-table-assigned-user/recurring-tickets-table-assigned-user.component';

@Component({
    selector: 'app-recurring-tickets-table-assigned-user-more',
    templateUrl: './recurring-tickets-table-assigned-user-more.component.html',
    styleUrls: ['./recurring-tickets-table-assigned-user-more.component.scss'],
    providers: [TicketsListService],
    standalone: true
})
export class RecurringTicketsTableAssignedUserMoreComponent extends RecurringTicketsTableAssignedUserComponent {

}