import { Component, OnInit } from '@angular/core';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';
import { REMOVE_UPDATE_TICKET_DETAIL, REMOVE_UPDATE_TICKET_DETAIL_SERVICE } from 'src/app/const/confirm';
import { TicketProfileService } from '../../../class/ticket-profile-service';
import { TicketProfileUpdate } from '../../../class/ticket-profile-update';
import { TicketProfileUpdatesServiceComponent } from '../../../ticket-edit-aside/ticket-profile-updates/ticket-profile-updates-service/ticket-profile-updates-service.component';

@Component({
  selector: 'ticket-detail-profile-updates-service',
  templateUrl: './ticket-detail-profile-updates-service.component.html',
  styleUrls: ['./ticket-detail-profile-updates-service.component.scss']
})
export class TicketDetailProfileUpdatesServiceComponent extends TicketProfileUpdatesServiceComponent {

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
    modalRef.componentInstance.message = `Do you want to remove the item?`;
  }
  remove() {
    this.ticketStateService.setUpdateForRemove(this.update);
    this.confirmStateService.setConfirmAction(REMOVE_UPDATE_TICKET_DETAIL);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.message = `The ticket update containing a service will become inaccessible. Continue with permanent deletion?`;
  }
  setClassForActions(data) {
    this.classActions = data;
  }

}
