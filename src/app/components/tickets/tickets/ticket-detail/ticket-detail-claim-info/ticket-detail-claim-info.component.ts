import { Component, OnInit } from '@angular/core';
import { TicketsPermissionsService } from '../../ticket-edit-aside/services/tickets-permissions.service';
import { TicketClaimInfoComponent } from '../../ticket-edit-aside/ticket-claim-info/ticket-claim-info.component';

@Component({
  selector: 'ticket-detail-claim-info',
  templateUrl: './ticket-detail-claim-info.component.html',
  styleUrls: ['./ticket-detail-claim-info.component.scss'],
  providers: [TicketsPermissionsService]
})
export class TicketDetailClaimInfoComponent extends TicketClaimInfoComponent {
}
