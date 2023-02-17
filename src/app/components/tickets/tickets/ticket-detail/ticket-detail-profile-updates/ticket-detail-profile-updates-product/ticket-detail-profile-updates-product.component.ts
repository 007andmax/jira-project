import { Component, Input, OnInit } from '@angular/core';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';
import { REMOVE_UPDATE_TICKET_DETAIL } from 'src/app/const/confirm';
import { TicketProfileUpdatesProductComponent } from '../../../ticket-edit-aside/ticket-profile-updates/ticket-profile-updates-product/ticket-profile-updates-product.component';

@Component({
  selector: 'ticket-detail-profile-updates-product',
  templateUrl: './ticket-detail-profile-updates-product.component.html',
  styleUrls: ['./ticket-detail-profile-updates-product.component.scss']
})
export class TicketDetailProfileUpdatesProductComponent extends TicketProfileUpdatesProductComponent {


  isIOSDevice() {
    return !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
  }
  remove() {
    this.ticketStateService.setUpdateForRemove(this.update);
    this.confirmStateService.setConfirmAction(REMOVE_UPDATE_TICKET_DETAIL);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.message = `The ticket update containing a service will become inaccessible. Continue with permanent deletion?`;
  }
}
