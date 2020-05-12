import { Component, OnInit, Input } from '@angular/core';
import { TicketProfileUpdate } from '../../../class/ticket-profile-update';
import { TicketProfileShare } from '../../../class/ticket-profile-share';
import { TicketsListService } from '../../../services/tickets-list.service';
import * as moment from "moment";
import { ConfirmStateService } from 'src/ng2/app/components/shared/confirm/services/confirm-state.service';
import { TicketStateService } from '../../services/ticket-state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { REMOVE_UPDATE_TICKET, REMOVE_UPDATE_TICKET_SERVICE, REMOVE_UPDATE_TICKET_PRODUCT } from 'src/ng2/app/const/confirm';
import { ConfirmComponent } from 'src/ng2/app/components/shared/confirm/confirm.component';

@Component({
  selector: 'app-ticket-profile-updates-product',
  templateUrl: './ticket-profile-updates-product.component.html',
  styleUrls: ['./ticket-profile-updates-product.component.scss']
})
export class TicketProfileUpdatesProductComponent implements OnInit {
  @Input() update: TicketProfileUpdate;
  constructor(public ticketsListService: TicketsListService,
    private confirmStateService: ConfirmStateService,
    private ticketStateService:TicketStateService,
    private modalService: NgbModal) { }

  ngOnInit() {
  }
  public getTotal(price, quantity) {
    return price * quantity;
  }
  public getDate(date) {
    return moment(new Date(date)).format('DD MMM YYYY');
  }
  remove() {
    this.ticketStateService.setUpdateForRemove(this.update);
    this.confirmStateService.setConfirmAction(REMOVE_UPDATE_TICKET);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal' });
    modalRef.componentInstance.message = `The ticket update containing a service will become inaccessible. Continue with permanent deletion?`;
  }

}
