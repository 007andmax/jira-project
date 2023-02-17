import { Component, Input, OnInit } from '@angular/core';
import { REMOVE_UPDATE_TICKET, REMOVE_UPDATE_TICKET_SERVICE, REMOVE_UPDATE_TICKET_PRODUCT, REMOVE_UPDATE_TICKET_DETAIL_SERVICE, REMOVE_UPDATE_TICKET_DETAIL_PRODUCT, REMOVE_UPDATE_TICKET_DETAIL } from 'src/app/const/confirm';
import { TicketsPermissionsService } from '../../ticket-edit-aside/services/tickets-permissions.service';
import { TicketProfileUpdatesComponent } from '../../ticket-edit-aside/ticket-profile-updates/ticket-profile-updates.component';

@Component({
  selector: 'ticket-detail-profile-updates',
  templateUrl: './ticket-detail-profile-updates.component.html',
  styleUrls: ['./ticket-detail-profile-updates.component.scss'],
  providers: [TicketsPermissionsService]
})
export class TicketDetailProfileUpdatesComponent extends TicketProfileUpdatesComponent {

  ngOnInit() {
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === REMOVE_UPDATE_TICKET_DETAIL) {
          this.removeUpdate();
        }
        if (this.confirmStateService.getConfirmAction() === REMOVE_UPDATE_TICKET_DETAIL_SERVICE) {
          this.removeService();
        }
        if (this.confirmStateService.getConfirmAction() === REMOVE_UPDATE_TICKET_DETAIL_PRODUCT) {
          this.removeProduct();
        }

      }
    })
    this.sub.add(getConfirm);
  }
}
