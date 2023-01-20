import { Component, Input, OnInit } from '@angular/core';
import { TicketsPermissionsService } from '../../ticket-edit-aside/services/tickets-permissions.service';
import { TicketProfileUpdatesComponent } from '../../ticket-edit-aside/ticket-profile-updates/ticket-profile-updates.component';

@Component({
  selector: 'ticket-detail-profile-updates',
  templateUrl: './ticket-detail-profile-updates.component.html',
  styleUrls: ['./ticket-detail-profile-updates.component.scss'],
  providers: [TicketsPermissionsService]
})
export class TicketDetailProfileUpdatesComponent extends TicketProfileUpdatesComponent {

}
