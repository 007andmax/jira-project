import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { TicketProfileUpdate } from '../../class/ticket-profile-update';
import { TicketsService } from 'src/ng2/app/services/tickets/tickets.service';
import { TicketProfile } from '../../class/ticket-profile';
import { NotificationStateService } from 'src/ng2/app/components/shared/notification/services/notification-state.service';
import { ConfirmStateService } from 'src/ng2/app/components/shared/confirm/services/confirm-state.service';
import { REMOVE_UPDATE_TICKET, REMOVE_UPDATE_TICKET_SERVICE, REMOVE_UPDATE_TICKET_PRODUCT } from 'src/ng2/app/const/confirm';
import { TicketStateService } from '../services/ticket-state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ticket-profile-updates',
  templateUrl: './ticket-profile-updates.component.html',
  styleUrls: ['./ticket-profile-updates.component.scss']
})
export class TicketProfileUpdatesComponent implements OnInit, OnDestroy {
  @Input() updates: Array<TicketProfileUpdate>;
  @Input() ticketProfile: TicketProfile = new TicketProfile();
  sub: Subscription = new Subscription();
  constructor(private ticketsService: TicketsService,
    private confirmStateService: ConfirmStateService,
    private ticketStateService: TicketStateService,
    private notificationStateService: NotificationStateService, ) { }


  ngOnInit() {
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === REMOVE_UPDATE_TICKET) {
          this.removeUpdate();
        }
        if (this.confirmStateService.getConfirmAction() === REMOVE_UPDATE_TICKET_SERVICE) {
          this.removeService();
        }
        if (this.confirmStateService.getConfirmAction() === REMOVE_UPDATE_TICKET_PRODUCT) {
          this.removeProduct();
        }

      }
    })
    this.sub.add(getConfirm);
  }
  removeService() {
    this.ticketsService.removeService(this.ticketProfile.id, this.ticketStateService.getUpdateForRemove().id, this.ticketStateService.getServiceForRemove().id).subscribe(data => {


    })
  }
  removeProduct() {
    this.ticketsService.removeProduct(this.ticketProfile.id, this.ticketStateService.getUpdateForRemove().id, this.ticketStateService.getProductForRemove().id).subscribe(data => {


    })
  }
  removeUpdate() {
    this.ticketsService.deleteUpdate(this.ticketProfile.id, this.ticketStateService.getUpdateForRemove().id).subscribe(data => {
      this.notificationStateService.oninitShowNotification(`The ticket update containing a note has been deleted`);

    })
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
