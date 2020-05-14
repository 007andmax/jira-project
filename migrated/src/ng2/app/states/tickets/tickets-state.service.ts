import { Injectable, EventEmitter } from '@angular/core';
import { TicketsRealTimeService } from './tickets-real-time.service';
import { TicketProfile } from '../../components/tickets/tickets/class/ticket-profile';
import { ServiceAgreementsService } from '../../services/service-agreements/service-agreements.service';

@Injectable({
  providedIn: 'root'
})
export class TicketsStateService {
  clearFormUpdate:EventEmitter<any> = new EventEmitter();
  actualNumber: EventEmitter<any> = new EventEmitter();
  addTicket: EventEmitter<any> = new EventEmitter();
  updateTicket: EventEmitter<any> = new EventEmitter();
  openTicket: EventEmitter<any> = new EventEmitter();
  editTicket: EventEmitter<TicketProfile> = new EventEmitter();
  filter: EventEmitter<any> = new EventEmitter();
  updateCounts: EventEmitter<any> = new EventEmitter();
  colorStatus: EventEmitter<any> = new EventEmitter();
  status: EventEmitter<any> = new EventEmitter();
  count: EventEmitter<number> = new EventEmitter();
  toggleAddTicket: EventEmitter<any> = new EventEmitter();
  ticketChangedActions = ['ASSIGNED_USER', 'PRIORITY_CHANGED', 'STATUS', 'TRASH', 'REPORT_AS_SPAM', 'RESTORE_FROM_SPAM', 'TICKET_SHARE', 'MARKED_AS_SPAM', 'EDITED_TICKET','RECURRING_TICKETS_OPEN', 'RECURRING_TICKETS_CLOSED'];
  constructor(private ticketsRealTimeService: TicketsRealTimeService) { }

  public onInit() {
    this.ticketsRealTimeService.changeActualNumber.subscribe(newChange => {
      if (newChange.action === 'NUMBER_CHANGED' && newChange.data.type === "TICKET") {
        console.log("newChange.data", newChange.data);
        this.onInitActualNumber(newChange.data.numPart);
      }

    })
    this.ticketsRealTimeService.changeTickets.subscribe(newChange => {
      if (newChange.action === 'CREATED_TICKET') {
        console.log("newChange.data", newChange.data);
        this.addTicket.emit(newChange.data);
      }
      if (this.ticketChangedActions.indexOf(newChange.action) > -1) {
         
       
      /*  if (storage.openedTicket && newChange.data.id === storage.openedTicket.id) {
          Utils.customizeObj(newChange.data, storage.openedTicket);
        }*/
      /*  if (isTicketMatchesFilters(newChange.data, storage.lastParams)) {
          if (ticketById) {
            Utils.customizeObj(newChange.data, ticketById);
          } else if (insertToFitOrdering(newChange.data, storage.tickets)) { //returns true if inserted successfully
            storage.ticketsQuantity++;
            global++;
          }
        } else if (ticketById) {
          storage.tickets.splice(ticketIndex, 1);
          storage.ticketsQuantity--;
          global--;
        }
        */
       this.updateTicket.emit(newChange.data);
      }
      if (newChange.action === 'ALL_TICKETS_COUNT') {
        console.log("newChange.data", newChange.data);
        this.onUpdateCounts(newChange.data);
       
      }
      
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
  
  public getOnClearFormUpdate() {
    return this.clearFormUpdate;
  }
  
}
