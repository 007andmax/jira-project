import { Component, Input, OnInit } from '@angular/core';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';
import { REMOVE_UPDATE_TICKET_DETAIL_PRODUCT } from 'src/app/const/confirm';
import { TicketProfileUpdatesProductInfoComponent } from '../../../../ticket-edit-aside/ticket-profile-updates/ticket-profile-updates-product/ticket-profile-updates-product-info/ticket-profile-updates-product-info.component';

@Component({
  selector: 'ticket-detail-profile-updates-product-info',
  templateUrl: './ticket-detail-profile-updates-product-info.component.html',
  styleUrls: ['./ticket-detail-profile-updates-product-info.component.scss']
})
export class TicketDetailProfileUpdatesProductInfoComponent extends TicketProfileUpdatesProductInfoComponent {

  @Input() showCompleteLabel: boolean = false;

  removeProduct() {
    this.ticketStateService.setUpdateForRemove(this.update);
    this.ticketStateService.setProductForRemove(this.product);
    this.confirmStateService.setConfirmAction(REMOVE_UPDATE_TICKET_DETAIL_PRODUCT);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.message = `Do you want to remove the item?`;

  }
}
