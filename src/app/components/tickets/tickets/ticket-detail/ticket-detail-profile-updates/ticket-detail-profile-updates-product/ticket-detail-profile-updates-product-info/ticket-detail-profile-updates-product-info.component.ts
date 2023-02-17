import { Component, Input, OnInit } from '@angular/core';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';
import { REMOVE_UPDATE_TICKET_DETAIL_PRODUCT } from 'src/app/const/confirm';
import { TicketProfileProduct } from '../../../../class/ticket-profile-product';
import { TicketProfileUpdate } from '../../../../class/ticket-profile-update';
import { TicketProfileUpdatesProductInfoComponent } from '../../../../ticket-edit-aside/ticket-profile-updates/ticket-profile-updates-product/ticket-profile-updates-product-info/ticket-profile-updates-product-info.component';

@Component({
  selector: 'ticket-detail-profile-updates-product-info',
  templateUrl: './ticket-detail-profile-updates-product-info.component.html',
  styleUrls: ['./ticket-detail-profile-updates-product-info.component.scss']
})
export class TicketDetailProfileUpdatesProductInfoComponent extends TicketProfileUpdatesProductInfoComponent {

  @Input() showCompleteLabel: boolean = false;

  edit() {
    let update = new TicketProfileUpdate(JSON.parse(JSON.stringify(this.update)));
    update.products = [new TicketProfileProduct(JSON.parse(JSON.stringify(this.product)))];
    this.ticketStateService.editUpdateByFrom(update);
  }
  removeProduct() {
    this.ticketStateService.setUpdateForRemove(this.update);
    this.ticketStateService.setProductForRemove(this.product);
    this.confirmStateService.setConfirmAction(REMOVE_UPDATE_TICKET_DETAIL_PRODUCT);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.message = `Do you want to remove the item?`;

  }
}
