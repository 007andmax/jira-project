import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TicketsPermissionsService } from '../services/tickets-permissions.service';
import { TicketProfile } from '../../class/ticket-profile';
import { PermissionsService } from 'src/ng2/app/services/permissions/permissions.service';
import { CurrentUser } from 'src/ng2/class/current-user/current-user';
import { UsersStateService } from 'src/ng2/app/states/users/users-state.service';

@Component({
  selector: 'app-ticket-message',
  templateUrl: './ticket-message.component.html',
  styleUrls: ['./ticket-message.component.scss'],
  providers: [TicketsPermissionsService]
})
export class TicketMessageComponent implements OnInit {
  @Input() ticketProfile: TicketProfile = new TicketProfile();
  @Output() onClaimTicket = new EventEmitter();
  currentUser: CurrentUser;
  constructor(public ticketsPermissionsService: TicketsPermissionsService,
    private usersStateService: UsersStateService,
    private permissionsService: PermissionsService, ) { }

  ngOnInit() {
    this.currentUser = this.usersStateService.getCurrentUser();
  }
  public getUserName(user: CurrentUser) {
    return (user) ? `${user.firstName} ${user.lastName}` : '';
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  claimTicket() {
    this.onClaimTicket.emit(null);
  }

  public getDaysLeftToOpen() {
    var now = new Date().getTime(),
      msToDaysCof = 86400000;
    var isWithinThirtyDays = (now - this.ticketProfile.closedAt) / msToDaysCof;
    return Math.ceil(30 - isWithinThirtyDays);
  }
  getSpamMessages(userId, option) {
    var isCanMarkAsSpam = this.currentUser.isOwner && !this.ticketProfile.spamMarker;

    if (this.currentUser.id === userId) {
      if (option === 'MARK') {
        return 'marked this ticket as spam, but you can ' +
          (this.ticketsPermissionsService.isActionVisible('delete_forever', this.ticketProfile, null, null) ? 'either delete the ticket forever or ' : '') +
          'restore the ticket status anytime, using the respective option.';
      } else {
        return 'reported this ticket as spam, but you can ' +
          (this.ticketsPermissionsService.isActionVisible('delete_forever', this.ticketProfile, null, null) ? 'either delete the ticket forever or ' : '') +
          'restore the ticket status anytime, using the respective option.';
      }
    } else {
      if (option === 'MARK') {
        if (this.ticketsPermissionsService.isActionVisible('delete_forever', this.ticketProfile, null, null)) {
          return 'has marked it as spam. You can either delete the ticket forever or restore the ticket status anytime, using the respective option.';
        } else {
          return 'has marked it as spam. You can restore the ticket status anytime, using the respective option.';
        }
      } else {
        if (this.ticketsPermissionsService.isActionVisible('delete_forever', this.ticketProfile, null, null)) {
          return 'has reported it as spam. You can either ' +
            (isCanMarkAsSpam ? 'mark it as spam or ' : '') +
            'delete the ticket forever or restore the ticket status anytime, using the respective option.';
        } else {
          return 'has reported it as spam. You can ' +
            (isCanMarkAsSpam ? 'mark it as spam or ' : '') +
            'restore the ticket status anytime, using the respective option.';
        }
      }
    }
  };
}
