
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { TicketsPermissionsService } from '../../ticket-edit-aside/services/tickets-permissions.service';
import { DisabledBtnDirective } from 'src/app/directives/disabled-btn/disabled-btn.directive';
import { TicketProfile } from '../../class/ticket-profile';
import { CurrentUser } from 'src/class/current-user/current-user';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { DELETE_FOREVER, MOVE_TO_SPAM_OR_REPORT_TICKET } from 'src/app/const/confirm';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';
import { Subscription } from 'rxjs';
import { PreloaderTicketComponent } from 'src/app/components/shared/preloader-ticket/preloader-ticket.component';

@Component({
  standalone: true,
  imports: [PreloaderTicketComponent, CommonModule],
  selector: 'ticket-detail-message',
  templateUrl: './ticket-detail-message.component.html',
  styleUrls: ['./ticket-detail-message.component.scss'],
  providers: [TicketsPermissionsService]
})
export class TicketDetailMessageComponent implements OnInit, OnDestroy {
  @ViewChild('claimTicketBtn', { static: false }) claimTicketBtn: DisabledBtnDirective;
  @ViewChild('markAsOpenBillableBtn', { static: false }) markAsOpenBillableBtn: DisabledBtnDirective;
  @ViewChild('markAsOpenBtn', { static: false }) markAsOpenBtn: DisabledBtnDirective;
  @Input() ticketProfile: TicketProfile = new TicketProfile();
  @Output() onClaimTicket = new EventEmitter();
  @Output() onOpenTicket = new EventEmitter();
  @Output() onRestoreFromSpam = new EventEmitter();
  @Output() onMoveToTrash = new EventEmitter();
  currentUser: CurrentUser;
  isClaimTicket: boolean = false;
  isMarkAsOpen: boolean = false;
  sub: Subscription = new Subscription();
  constructor(public ticketsPermissionsService: TicketsPermissionsService,
    private usersStateService: UsersStateService,
    private confirmStateService: ConfirmStateService,
    private modalService: NgbModal,
    private permissionsService: PermissionsService,) { }


  ngOnInit() {
    this.currentUser = this.usersStateService.getCurrentUser();
    let onGetCurrentUser = this.usersStateService.onGetCurrentUser.subscribe(data => {
      this.currentUser = data;
    })
    this.sub.add(onGetCurrentUser);
  }
  public getUserName(user: CurrentUser) {
    return (user) ? `${user.firstName} ${user.lastName}` : '';
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  public reset() {
    this.isClaimTicket = false;
    this.isMarkAsOpen = false;
  }
  claimTicket() {
    this.claimTicketBtn.setDisabled(true);
    this.isClaimTicket = true;
    this.onClaimTicket.emit(null);
  }
  markAsOpen() {
    this.isMarkAsOpen = true;
    if (this.markAsOpenBillableBtn) this.markAsOpenBillableBtn.setDisabled(true);
    this.onOpenTicket.emit(null);
  }
  deleteForever() {
    this.confirmStateService.setConfirmAction(DELETE_FOREVER);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.header = `Delete Ticket`;
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
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.header = `Move to spam`;
    modalRef.componentInstance.message = `Are you sure you want to ${this.currentUser.isOwner ? 'mark' : 'report'} the ticket as spam?`;
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
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
