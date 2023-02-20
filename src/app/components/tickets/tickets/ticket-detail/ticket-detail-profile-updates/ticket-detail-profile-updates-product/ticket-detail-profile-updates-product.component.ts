import { Component, Input, OnInit } from '@angular/core';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';
import { REMOVE_UPDATE_TICKET_DETAIL, REMOVE_UPDATE_TICKET_DETAIL_PRODUCT } from 'src/app/const/confirm';
import { TicketProfileProduct } from '../../../class/ticket-profile-product';
import { TicketProfileUpdate } from '../../../class/ticket-profile-update';
import { TicketProfileUpdatesProductComponent } from '../../../ticket-edit-aside/ticket-profile-updates/ticket-profile-updates-product/ticket-profile-updates-product.component';

@Component({
  selector: 'ticket-detail-profile-updates-product',
  templateUrl: './ticket-detail-profile-updates-product.component.html',
  styleUrls: ['./ticket-detail-profile-updates-product.component.scss']
})
export class TicketDetailProfileUpdatesProductComponent extends TicketProfileUpdatesProductComponent {

  classActions: string = '';
  isIOSDevice() {
    return !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
  }
  remove() {
    this.ticketStateService.setUpdateForRemove(this.update);
    this.confirmStateService.setConfirmAction(REMOVE_UPDATE_TICKET_DETAIL);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.message = `The ticket update containing a service will become inaccessible. Continue with permanent deletion?`;
  }
  removeProduct() {
    this.ticketStateService.setUpdateForRemove(this.update);
    this.ticketStateService.setProductForRemove(this.update.products[0]);
    this.confirmStateService.setConfirmAction(REMOVE_UPDATE_TICKET_DETAIL_PRODUCT);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.message = `Do you want to remove the item?`;

  }
  edit() {
    let update = new TicketProfileUpdate(JSON.parse(JSON.stringify(this.update)));
    update.products = [new TicketProfileProduct(JSON.parse(JSON.stringify(this.update.products[0])))];
    this.ticketStateService.editUpdateByFrom(update);
  }
  setClassForActions(i, data) {
    if (i == 0) this.classActions = data;
  }
}
