import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TicketsListService } from '../../../../services/tickets-list.service';
import { ConfirmStateService } from 'src/ng2/app/components/shared/confirm/services/confirm-state.service';
import { TicketStateService } from '../../../services/ticket-state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { REMOVE_UPDATE_TICKET, REMOVE_UPDATE_TICKET_SERVICE } from 'src/ng2/app/const/confirm';
import { ConfirmComponent } from 'src/ng2/app/components/shared/confirm/confirm.component';
import { TicketProfileUpdate } from '../../../../class/ticket-profile-update';
import { TicketProfileService } from '../../../../class/ticket-profile-service';

@Component({
  selector: 'app-ticket-profile-updates-service-info',
  templateUrl: './ticket-profile-updates-service-info.component.html',
  styleUrls: ['./ticket-profile-updates-service-info.component.scss']
})
export class TicketProfileUpdatesServiceInfoComponent implements OnInit {
  @Input() update: TicketProfileUpdate;
  @Input() service: TicketProfileService;
  @Output() onEdit = new EventEmitter();
  constructor(public ticketsListService: TicketsListService,
    private confirmStateService: ConfirmStateService,
    private ticketStateService:TicketStateService,
    private modalService: NgbModal) { }

  ngOnInit() {
  }
  edit() {
    this.onEdit.emit(null);
  }
  public getDate(date) {
    return moment(new Date(date)).format('DD MMM YYYY');
  }
  public getTime(time) {
    return moment(new Date(time)).format('hh:mm A');
  }
  public getDuration(quantity) {
    var timeInMinutes = quantity * 60,
    hours = Math.floor(timeInMinutes / 60),
    minutes = Math.round(timeInMinutes - (hours * 60));
    return`${(hours < 10) ? '0' + hours : hours} : ${(minutes < 10) ? '0' + minutes : minutes}`
  }
  remove() {
    this.ticketStateService.setUpdateForRemove(this.update);
    this.confirmStateService.setConfirmAction(REMOVE_UPDATE_TICKET);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal' });
    modalRef.componentInstance.message = `The ticket update containing a service will become inaccessible. Continue with permanent deletion?`;
  }
  removeService(i) {
    this.ticketStateService.setUpdateForRemove(this.update);
    this.ticketStateService.setServiceForRemove(this.update.services[i]);
    this.confirmStateService.setConfirmAction(REMOVE_UPDATE_TICKET_SERVICE);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal' });
    modalRef.componentInstance.message = `Do you want to remove the item?`;
   
  }
}
