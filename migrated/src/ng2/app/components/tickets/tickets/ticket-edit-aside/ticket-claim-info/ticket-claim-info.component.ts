import { Component, OnInit, Input } from '@angular/core';
import { TicketsPermissionsService } from '../services/tickets-permissions.service';
import { TicketProfile } from '../../class/ticket-profile';
import { CurrentUser } from 'src/ng2/class/current-user/current-user';

@Component({
  selector: 'app-ticket-claim-info',
  templateUrl: './ticket-claim-info.component.html',
  styleUrls: ['./ticket-claim-info.component.scss'],
  providers: [TicketsPermissionsService]
})
export class TicketClaimInfoComponent implements OnInit {
  @Input() ticketProfile: TicketProfile = new TicketProfile();
  constructor(
    public ticketsPermissionsService: TicketsPermissionsService,
  ) { }

  ngOnInit() {
  }
  public getUserName(user: CurrentUser) {
    return `${user.firstName} ${user.lastName}`;
  }
}
