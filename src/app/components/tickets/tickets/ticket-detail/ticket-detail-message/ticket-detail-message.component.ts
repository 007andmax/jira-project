import { Component, OnInit } from '@angular/core';
import { TicketsPermissionsService } from '../../ticket-edit-aside/services/tickets-permissions.service';
import { TicketMessageComponent } from '../../ticket-edit-aside/ticket-message/ticket-message.component';

@Component({
  selector: 'ticket-detail-message',
  templateUrl: './ticket-detail-message.component.html',
  styleUrls: ['./ticket-detail-message.component.scss'],
  providers: [TicketsPermissionsService]
})
export class TicketDetailMessageComponent extends TicketMessageComponent {



}
