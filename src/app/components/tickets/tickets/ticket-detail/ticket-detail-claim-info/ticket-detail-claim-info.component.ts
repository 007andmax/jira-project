import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { TicketsPermissionsService } from '../../ticket-edit-aside/services/tickets-permissions.service';
import { TicketProfile } from '../../class/ticket-profile';
import { CurrentUser } from 'src/class/current-user/current-user';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'ticket-detail-claim-info',
  templateUrl: './ticket-detail-claim-info.component.html',
  styleUrls: ['./ticket-detail-claim-info.component.scss'],
  providers: [TicketsPermissionsService]
})
export class TicketDetailClaimInfoComponent implements OnInit {
  @Input() ticketProfile: TicketProfile = new TicketProfile();
  constructor(
    public ticketsPermissionsService: TicketsPermissionsService,
  ) { }

  ngOnInit() {
  }
  public getUserName(user: CurrentUser) {
    return (user) ? `${user.firstName} ${user.lastName}` : '';
  }
  public getMultiAssignedUsers() {
    let users = (this.ticketProfile.multiAssignedUsers) ? this.ticketProfile.multiAssignedUsers.map(item => {
      return this.getUserName(item);
    }) : [];
    return users.join(",");
  }
}