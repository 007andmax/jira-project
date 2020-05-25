import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TicketsPermissionsService } from '../services/tickets-permissions.service';
import { TicketProfile } from '../../class/ticket-profile';
import { PermissionsService } from 'src/ng2/app/services/permissions/permissions.service';
import { CurrentUser } from 'src/ng2/class/current-user/current-user';
import { UsersStateService } from 'src/ng2/app/states/users/users-state.service';
import { ConfirmStateService } from 'src/ng2/app/components/shared/confirm/services/confirm-state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DELETE_FOREVER, MOVE_TO_SPAM_TICKET, MOVE_TO_SPAM_OR_REPORT_TICKET } from 'src/ng2/app/const/confirm';
import { ConfirmComponent } from 'src/ng2/app/components/shared/confirm/confirm.component';

@Component({
  selector: 'app-ticket-message',
  templateUrl: './ticket-message.component.html',
  styleUrls: ['./ticket-message.component.scss'],
  providers: [TicketsPermissionsService]
})
export class TicketMessageComponent implements OnInit {
  @Input() ticketProfile: TicketProfile = new TicketProfile();
  @Output() onClaimTicket = new EventEmitter();
  @Output() onOpenTicket = new EventEmitter();
  @Output() onRestoreFromSpam = new EventEmitter();
  @Output() onMoveToTrash = new EventEmitter();
  currentUser: CurrentUser;
  constructor(public ticketsPermissionsService: TicketsPermissionsService,
    private usersStateService: UsersStateService,
    private confirmStateService: ConfirmStateService,
    private modalService: NgbModal,
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
  markAsOpen() {
    this.onOpenTicket.emit(null);
  }
  deleteForever() {
    this.confirmStateService.setConfirmAction(DELETE_FOREVER);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal' });
    modalRef.componentInstance.message = `The ticket will become inaccessible. Continue with permanent deletion?`;
  }
  restoreFromSpam() {
    this.onRestoreFromSpam.emit(null);
  }
  public getDaysLeftToOpen() {
    var now = new Date().getTime(),
      msToDaysCof = 86400000;
    var isWithinThirtyDays = (now - this.ticketProfile.closedAt) / msToDaysCof;
    return Math.ceil(30 - isWithinThirtyDays);
  }
  moveToTrash(value) {
    this.onMoveToTrash.emit(value);
  }
  moveIntoSpam() {
    this.confirmStateService.setConfirmAction(MOVE_TO_SPAM_OR_REPORT_TICKET);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal' });
    modalRef.componentInstance.message = `Do you want to ${this.currentUser.isOwner ? 'mark' : 'report'} the ticket as spam?`;
  };
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
