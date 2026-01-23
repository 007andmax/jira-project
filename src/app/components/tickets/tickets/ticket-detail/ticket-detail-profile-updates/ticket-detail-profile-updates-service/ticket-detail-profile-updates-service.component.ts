import { Component, Input, OnInit } from '@angular/core';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';
import { REMOVE_UPDATE_TICKET_DETAIL, REMOVE_UPDATE_TICKET_DETAIL_SERVICE } from 'src/app/const/confirm';
import { TicketProfileService } from '../../../class/ticket-profile-service';
import { TicketProfileUpdate } from '../../../class/ticket-profile-update';
import { TicketsListService } from '../../../services/tickets-list.service';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { TicketStateService } from '../../../ticket-edit-aside/services/ticket-state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ticket-detail-profile-updates-service',
  templateUrl: './ticket-detail-profile-updates-service.component.html',
  styleUrls: ['./ticket-detail-profile-updates-service.component.scss']
})
export class TicketDetailProfileUpdatesServiceComponent implements OnInit {
  @Input() update: TicketProfileUpdate;
  @Input() isBlockChange: boolean;
  constructor(public ticketsListService: TicketsListService,
    public confirmStateService: ConfirmStateService,
    public ticketStateService: TicketStateService,
    public modalService: NgbModal) { }

  ngOnInit() {
  }
  classActions: string = '';
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
