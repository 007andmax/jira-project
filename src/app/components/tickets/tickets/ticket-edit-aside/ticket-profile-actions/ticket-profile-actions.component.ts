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
import { Device } from 'src/app/components/company-devices/class/device';
import { DevicesService } from 'src/app/services/devices/devices.service';
import { TicketStateService } from '../services/ticket-state.service';

@Component({
  selector: 'app-ticket-profile-actions',
  templateUrl: './ticket-profile-actions.component.html',
  styleUrls: ['./ticket-profile-actions.component.scss'],
  providers: [TicketsPermissionsService]
})
export class TicketProfileActionsComponent implements OnInit, OnDestroy {
  @Output() onClaimTicket = new EventEmitter();
  @Input() ticketProfile: TicketProfile = new TicketProfile();
  devices: Array<Device> = [];
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
    private devicesService: DevicesService,
    public appService: AppService,
    private ticketStateService: TicketStateService
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
    this.devicesService.getCompanyDevices(this.ticketProfile.company.id).subscribe((res: any) => {
      this.devices = (res[this.ticketProfile.company.id]) ? JSON.parse(JSON.stringify(res[this.ticketProfile.company.id])).map(item => new Device(item)) : [];
      this.ticketStateService.setDevices(this.devices);
    });
    let onDeviceUninstalled = this.devicesStateService.onChangeDevice.subscribe(newChange => {
      if (this.ticketProfile.company.id == newChange.data.clientCompanyId) this.devicesStateService.changeDevice(this.devices, newChange);
    })
    this.sub.add(onDeviceUninstalled);
  }
  showAgentLink() {
    if (!this.appService.checkMobile()) return;
    const modalRef = this.modalService.open(ModalAgentLinkComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.ticketProfile = this.ticketProfile;
    modalRef.componentInstance.devices = this.devices;
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
  isDeviceToLink() {
    if (!this.ticketProfile.agent || !this.ticketProfile.agent.deviceId) return true;
    return this.devices.filter((agent) => agent.id !== this.ticketProfile.agent.deviceId).length;
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
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.message = `Do you want to move the ticket to Trash?`;
  };

  moveIntoSpam() {
    this.confirmStateService.setConfirmAction(MOVE_TO_SPAM_TICKET);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.message = `Do you want to mark the ticket as spam?`;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
