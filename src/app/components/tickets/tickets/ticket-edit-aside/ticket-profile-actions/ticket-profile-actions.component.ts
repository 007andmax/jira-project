import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { TicketsPermissionsService } from '../services/tickets-permissions.service';
import { CurrentUser } from 'src/class/current-user/current-user';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { TicketProfile } from '../../class/ticket-profile';
import { DevicesStateService } from 'src/app/states/devices/devices-state.service';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { MOVE_TO_SPAM_TICKET, MOVE_TO_TRASH_TICKET } from 'src/app/const/confirm';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { ModalAgentLinkComponent } from 'src/app/services/modal/modal-agent-link/modal-agent-link.component';
import { AppService } from 'src/app/states/app/app.service';

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
    private devicesStateService: DevicesStateService,
    private ticketsService: TicketsService,
    private usersStateService: UsersStateService,
    private confirmStateService: ConfirmStateService,
    private modalService: NgbModal,
    public appService: AppService,
  ) { }


  ngOnInit() {
    this.currentUser = this.usersStateService.getCurrentUser();
    this.usersStateService.getOnGetCurrentuser().subscribe(data => {
      this.currentUser = data;
    })
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
    console.log("this.currentUser", this.currentUser);
  }
  showAgentLink() {
    if (!this.appService.checkMobile()) return;
    const modalRef = this.modalService.open(ModalAgentLinkComponent, { windowClass: 'xs-modal user-modal' });
    modalRef.componentInstance.devices = this.getDevicesByCompany();
    modalRef.componentInstance.ticketProfile = this.ticketProfile;

  }
  onMoveToTrash() {
    this.ticketsService.trashTicket(this.ticketProfile.id, this.movedWay).subscribe(res => {
    })
  }
  onMoveToSpam() {
    if (this.currentUser.isOwner) {
      this.ticketsService.markAsSpamTicket(this.ticketProfile.id, false).subscribe(res => {
      })

    } else {
      this.ticketsService.reportAsSpamTicket(this.ticketProfile.id, false).subscribe(res => {
      })
    }
  }
  getDevicesByCompany() {
    let find = (this.devicesStateService.getAllDevices()) ? this.devicesStateService.getAllDevices()[this.ticketProfile.company.id] : false;
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
