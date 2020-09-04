import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { TicketsPermissionsService } from '../services/tickets-permissions.service';
import { CurrentUser } from 'src/ng2/class/current-user/current-user';
import { UsersStateService } from 'src/ng2/app/states/users/users-state.service';
import { TicketProfile } from '../../class/ticket-profile';
import { DevicesSateService } from 'src/ng2/app/states/devices/devices-sate.service';
import { TicketsService } from 'src/ng2/app/services/tickets/tickets.service';
import { NotificationStateService } from 'src/ng2/app/components/shared/notification/services/notification-state.service';
import { ConfirmStateService } from 'src/ng2/app/components/shared/confirm/services/confirm-state.service';
import { MOVE_TO_SPAM_TICKET, MOVE_TO_TRASH_TICKET } from 'src/ng2/app/const/confirm';
import { ConfirmComponent } from 'src/ng2/app/components/shared/confirm/confirm.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ticket-profile-actions',
  templateUrl: './ticket-profile-actions.component.html',
  styleUrls: ['./ticket-profile-actions.component.scss'],
  providers: [TicketsPermissionsService]
})
export class TicketProfileActionsComponent implements OnInit, OnDestroy {
  @Output() onClaimTicket = new EventEmitter();
  @Input() ticketProfile: TicketProfile = new TicketProfile();
  currentUser: CurrentUser;
  movedWay: boolean = false;
  sub = new Subscription();
  constructor(
    public ticketsPermissionsService: TicketsPermissionsService,
    private devicesSateService: DevicesSateService,
    private ticketsService: TicketsService,
    private notificationStateService: NotificationStateService,
    private usersStateService: UsersStateService,
    private confirmStateService: ConfirmStateService,
    private modalService: NgbModal,
  ) { }


  ngOnInit() {
    this.currentUser = this.usersStateService.getCurrentUser();
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === MOVE_TO_SPAM_TICKET) {
          this.onMoveToSpam();
        }
        if (this.confirmStateService.getConfirmAction() === MOVE_TO_TRASH_TICKET) {
          this.onMoveToTrash();
        }
      }
    })
    this.sub.add(getConfirm);
  }
  onMoveToTrash() {
    this.ticketsService.trashTicket(this.ticketProfile.id, this.movedWay).subscribe(res => {
      if (this.movedWay) this.notificationStateService.oninitShowNotification(`The ticket “${this.ticketProfile.number}” has been moved to Trash`);
    })
  }
  onMoveToSpam() {
    if (this.currentUser.isOwner) {
      this.ticketsService.markAsSpamTicket(this.ticketProfile.id, false).subscribe(res => {
        this.notificationStateService.oninitShowNotification(`The ticket “${this.ticketProfile.number}” has been marked as spam`);
      })

    } else {
      this.ticketsService.reportAsSpamTicket(this.ticketProfile.id, false).subscribe(res => {
        this.notificationStateService.oninitShowNotification(`The ticket “${this.ticketProfile.number}” has been reported as spam`);
      })
    }
  }
  getDevicesByCompany() {
    let find = (this.devicesSateService.getAllDevices()) ? this.devicesSateService.getAllDevices()[this.ticketProfile.company.id] : false;
    return (find) ? find : []
  }
  isDeviceToLink() {
    if (!this.ticketProfile.agent || !this.ticketProfile.agent.deviceId) return true;
    return this.getDevicesByCompany().filter((agent) => agent.id !== this.ticketProfile.agent.deviceId).length;
  };

  claimTicket() {
    this.onClaimTicket.emit(null);
  }

  changeLinkedAgent(id) {
    this.ticketsService.linkedAgentToTicket(this.ticketProfile.id, id).subscribe(res => {

    })
  }

  moveToTrash(movedWay) {
    this.movedWay = movedWay;
    this.confirmStateService.setConfirmAction(MOVE_TO_TRASH_TICKET);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal' });
    modalRef.componentInstance.message = `Do you want to move the ticket to Trash?`;
  };

  moveIntoSpam() {
    this.confirmStateService.setConfirmAction(MOVE_TO_SPAM_TICKET);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal' });
    modalRef.componentInstance.message = `Do you want to mark the ticket as spam?`;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
