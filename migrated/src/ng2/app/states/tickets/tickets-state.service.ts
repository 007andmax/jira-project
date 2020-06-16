import { Injectable, EventEmitter } from '@angular/core';
import { TicketsRealTimeService } from './tickets-real-time.service';
import { TicketProfile } from '../../components/tickets/tickets/class/ticket-profile';
import { ServiceAgreementsService } from '../../services/service-agreements/service-agreements.service';
import { TicketChangeField } from '../../components/tickets/tickets/class/ticket-change-field';
import { WebsocketService } from '../../services/websocket/websocket.service';

@Injectable({
  providedIn: 'root'
})
export class TicketsStateService {
  clearFormUpdate: EventEmitter<any> = new EventEmitter();
  actualNumber: EventEmitter<any> = new EventEmitter();
  addTicket: EventEmitter<any> = new EventEmitter();
  updateTicket: EventEmitter<any> = new EventEmitter();
  changeFieldTicket: EventEmitter<TicketChangeField> = new EventEmitter();
  openTicket: EventEmitter<any> = new EventEmitter();
  removeTicket: EventEmitter<any> = new EventEmitter();
  editTicket: EventEmitter<TicketProfile> = new EventEmitter();
  filter: EventEmitter<any> = new EventEmitter();
  updateCounts: EventEmitter<any> = new EventEmitter();
  colorStatus: EventEmitter<any> = new EventEmitter();
  status: EventEmitter<any> = new EventEmitter();
  count: EventEmitter<number> = new EventEmitter();
  toggleAddTicket: EventEmitter<any> = new EventEmitter();
  ticketChangedActions = ['ASSIGNED_USER', 'PRIORITY_CHANGED', 'STATUS', 'TRASH', 'REPORT_AS_SPAM', 'RESTORE_FROM_SPAM', 'TICKET_SHARE', 'MARKED_AS_SPAM', 'EDITED_TICKET'];
  constructor(private ticketsRealTimeService: TicketsRealTimeService) { }

  public onInit() {
    this.ticketsRealTimeService.changeActualNumber.subscribe(newChange => {
      if (newChange.action === 'NUMBER_CHANGED' && newChange.data.type === "TICKET") {
        this.onInitActualNumber(newChange.data.numPart);
      }
    })
    this.ticketsRealTimeService.changeTickets.subscribe(newChange => {
      if (newChange.action === 'CREATED_TICKET') {
        this.addTicket.emit(newChange.data);
      }
      if (this.ticketChangedActions.indexOf(newChange.action) > -1) {
        this.updateTicket.emit(newChange.data);
      }
      if (newChange.action === 'ALL_TICKETS_COUNT') this.onUpdateCounts(newChange.data);
      if (newChange.action === 'READ') this.changeFieldTicket.emit(new TicketChangeField("unread", newChange.data.id, false));
      if (newChange.action === 'TICKET_UPDATES_READ') this.changeFieldTicket.emit(new TicketChangeField("hasNewUpdates", newChange.data.id, false));
      if (newChange.action === 'TICKET_DELETED') this.removeTicket.emit(newChange.data);
      if (newChange.action === 'TICKET_BILLABLE') this.changeFieldTicket.emit(new TicketChangeField("isBillable", newChange.data.id, newChange.data.isBillable));
      if (newChange.action === 'TICKET_INVOICED') this.changeFieldTicket.emit(new TicketChangeField("hasInvoice", newChange.data.id, newChange.data.hasInvoice));
      if (newChange.action === 'LINKED_AGENT_CHANGED') this.changeFieldTicket.emit(new TicketChangeField("agent", newChange.data.id, (newChange.data.deviceId) ? { deviceId: newChange.data.deviceId } : null));
      if (newChange.action === 'DISCOUNT_CHANGED') this.changeFieldTicket.emit(new TicketChangeField("discount", newChange.data.id, newChange.data.discount));
    })


  }

 
  public onClearFormUpdate() {
    this.clearFormUpdate.emit(null);
  }
  public onOpenTicket() {
    this.openTicket.emit(null);
  }
  public onEditTicket(data) {
    this.editTicket.emit(data);
  }
  public getOnEditTicket() {
    return this.editTicket;
  }
  public onUpdateCounts(data) {
    this.updateCounts.emit(data);
  }

  public onInitActualNumber(data) {
    this.actualNumber.emit(data);
  }
  public onInitFilter(data) {
    this.filter.emit(data);
  }
  public onColorStatus(data) {
    this.colorStatus.emit(data);
  }
  public onInitStatus(data) {
    this.status.emit(data);
  }
  public onToggleAddTicket() {
    this.toggleAddTicket.emit(null);
  }
  public onInitCount(data) {
    this.count.emit(data);
  }
  public getOnActualNumber() {
    return this.actualNumber;
  }
  public getOnInitFilter() {
    return this.filter;
  }
  public getOnInitColor() {
    return this.colorStatus;
  }
  public getOnInitStatus() {
    return this.status;
  }
  public getOnInitCount() {
    return this.count;
  }
  public getToggleAddTicket() {
    return this.toggleAddTicket;
  }
  public getOnUpdateCounts() {
    return this.updateCounts;
  }
  public getOnOpenTicket() {
    return this.openTicket;
  }
  public getOnAddTicket() {
    return this.addTicket;
  }
  public getOnUpdateTicket() {
    return this.updateTicket;
  }
  public getOnRemoveTicket() {
    return this.removeTicket;
  }
  public getOnChangeFieldTicket() {
    return this.changeFieldTicket;
  }

  public getOnClearFormUpdate() {
    return this.clearFormUpdate;
  }

}
