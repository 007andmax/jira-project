import { Component, Input, OnInit } from '@angular/core';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';
import { REMOVE_UPDATE_TICKET_DETAIL_SERVICE } from 'src/app/const/confirm';
import { TicketProfileService } from '../../../../class/ticket-profile-service';
import { TicketProfileUpdate } from '../../../../class/ticket-profile-update';
import { TicketProfileUpdatesServiceInfoComponent } from '../../../../ticket-edit-aside/ticket-profile-updates/ticket-profile-updates-service/ticket-profile-updates-service-info/ticket-profile-updates-service-info.component';

@Component({
  selector: 'ticket-detail-profile-updates-service-info',
  templateUrl: './ticket-detail-profile-updates-service-info.component.html',
  styleUrls: ['./ticket-detail-profile-updates-service-info.component.scss']
})
export class TicketDetailProfileUpdatesServiceInfoComponent extends TicketProfileUpdatesServiceInfoComponent {
  @Input() showCompleteLabel: boolean = false;
  @Input() index: number;


  edit() {
    let update = new TicketProfileUpdate(JSON.parse(JSON.stringify(this.update)));
    update.services = [new TicketProfileService(JSON.parse(JSON.stringify(this.service)))];
    this.ticketStateService.editUpdateByFrom(update);
  }
  removeService() {
    this.ticketStateService.setUpdateForRemove(this.update);
    this.ticketStateService.setServiceForRemove(this.service);
    this.confirmStateService.setConfirmAction(REMOVE_UPDATE_TICKET_DETAIL_SERVICE);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.message = `Do you want to remove the item?`;
  }
}
