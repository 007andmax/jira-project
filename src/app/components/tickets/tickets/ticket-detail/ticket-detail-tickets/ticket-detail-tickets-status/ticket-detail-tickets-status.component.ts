import { Component } from '@angular/core';
import { TicketChangeStatusComponent } from '../../../ticket-edit-aside/ticket-change-status/ticket-change-status.component';

@Component({
  selector: 'ticket-detail-tickets-status',
  templateUrl: './ticket-detail-tickets-status.component.html',
  styleUrls: ['./ticket-detail-tickets-status.component.scss']
})
export class TicketDetailTicketsStatusComponent extends TicketChangeStatusComponent {

}
