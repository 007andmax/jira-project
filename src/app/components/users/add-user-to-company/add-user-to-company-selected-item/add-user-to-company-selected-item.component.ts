import { Component, OnInit } from '@angular/core';
import { TicketsListService } from 'src/app/components/tickets/tickets/services/tickets-list.service';
import { AssignedTicketUserSelectedItemComponent } from 'src/app/components/tickets/tickets/ticket-add-aside/assigned-ticket-user/assigned-ticket-user-selected-item/assigned-ticket-user-selected-item.component';

@Component({
  selector: 'app-add-user-to-company-selected-item',
  templateUrl: './add-user-to-company-selected-item.component.html',
  styleUrls: ['./add-user-to-company-selected-item.component.scss'],
  providers: [TicketsListService],
})
export class AddUserToCompanySelectedItemComponent extends AssignedTicketUserSelectedItemComponent {

  remove() {
    this.user.selected = false;
  }
}
