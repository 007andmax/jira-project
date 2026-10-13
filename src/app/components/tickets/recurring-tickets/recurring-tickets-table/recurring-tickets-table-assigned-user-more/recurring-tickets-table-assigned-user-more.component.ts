import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TicketsListService } from '../../../tickets/services/tickets-list.service';
import { RecurringTicketsTableAssignedUserComponent } from '../recurring-tickets-table-assigned-user/recurring-tickets-table-assigned-user.component';
import { TicketsTableItemRequestedByComponent } from '../../../tickets/tickets-table/tickets-table-item/tickets-table-item-requested-by/tickets-table-item-requested-by.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserLogoPopoverDirective } from 'src/app/directives/user-logo-popover/user-logo-popover.directive';

@Component({
  standalone: true,
  imports: [CommonModule, TicketsTableItemRequestedByComponent, UserLogoPopoverDirective, NgbModule],
  selector: 'app-recurring-tickets-table-assigned-user-more',
  templateUrl: './recurring-tickets-table-assigned-user-more.component.html',
  styleUrls: ['./recurring-tickets-table-assigned-user-more.component.scss'],
  providers: [TicketsListService],

})
export class RecurringTicketsTableAssignedUserMoreComponent extends RecurringTicketsTableAssignedUserComponent {

}