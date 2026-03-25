import { Component, Input, OnInit } from '@angular/core';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';
import { REMOVE_UPDATE_TICKET_DETAIL, REMOVE_UPDATE_TICKET_DETAIL_SERVICE } from 'src/app/const/confirm';
import { TicketProfileService } from '../../../class/ticket-profile-service';
import { TicketProfileUpdate } from '../../../class/ticket-profile-update';
import { TicketsListService } from '../../../services/tickets-list.service';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { TicketStateService } from '../../../ticket-edit-aside/services/ticket-state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { TicketProfile } from '../../../class/ticket-profile';

@Component({
  selector: 'ticket-detail-profile-updates-service',
  templateUrl: './ticket-detail-profile-updates-service.component.html',
  styleUrls: ['./ticket-detail-profile-updates-service.component.scss']
})
export class TicketDetailProfileUpdatesServiceComponent implements OnInit {
  @Input() ticketProfile: TicketProfile = new TicketProfile();
  @Input() update: TicketProfileUpdate;
  @Input() isBlockChange: boolean;
  indexNoAvatar: number = 0;
  listColorNoAvatar = [];
  classActions: string = '';
  constructor(public ticketsListService: TicketsListService,
    public confirmStateService: ConfirmStateService,
    public ticketStateService: TicketStateService,
    public usersStateService: UsersStateService,
    public modalService: NgbModal) { }

  ngOnInit() {
    this.listColorNoAvatar = this.ticketsListService.getListColorNoAvatar();
    this.indexNoAvatar = this.ticketsListService.randomInteger(0, 6);
  }
  getUserById(id) {
    return this.usersStateService.getAllUsers().find(item => item.id == id);
  }
  isIOSDevice() {
    return !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
  }
  edit() {
    let update = new TicketProfileUpdate(JSON.parse(JSON.stringify(this.update)));
    update.services = [new TicketProfileService(JSON.parse(JSON.stringify(this.update.services[0])))];
    this.ticketStateService.editUpdateByFrom(update);
  }
  removeService() {
    this.ticketStateService.setUpdateForRemove(this.update);
    this.ticketStateService.setServiceForRemove(this.update.services[0]);
    this.confirmStateService.setConfirmAction(REMOVE_UPDATE_TICKET_DETAIL_SERVICE);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.header = `Delete Ticket`;
    modalRef.componentInstance.message = `Are you sure you want to remove the item?`;
  }
  remove() {
    this.ticketStateService.setUpdateForRemove(this.update);
    this.confirmStateService.setConfirmAction(REMOVE_UPDATE_TICKET_DETAIL);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.header = `Delete Ticket`;
    modalRef.componentInstance.message = `The ticket update containing a service will become inaccessible. Continue with permanent deletion?`;
  }
  setClassForActions(i, data) {
    if (i == 0) this.classActions = data;
  }
  public trackById(index, item) {
    return item.id;
  }
}
