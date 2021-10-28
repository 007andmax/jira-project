import { Injectable, EventEmitter } from '@angular/core';
import { TicketsRealTimeService } from './tickets-real-time.service';
import { TicketProfile } from '../../components/tickets/tickets/class/ticket-profile';
import { ServiceAgreementsService } from '../../services/service-agreements/service-agreements.service';
import { TicketChangeField } from '../../components/tickets/tickets/class/ticket-change-field';
import { WebsocketService } from '../../services/websocket/websocket.service';
import { TicketsService } from '../../services/tickets/tickets.service';
import { TicketsCounts } from '../../components/tickets/tickets/class/tickets-counts';
import { TicketStatus } from 'src/app/components/setting/customizable-lists/class/ticket-status';
import { StatusColor } from 'src/app/components/tickets/class/status-color';

@Injectable({
  providedIn: 'root'
})
export class TicketsStateService {
  listType: string = "USERS";
  ticketsCounts: TicketsCounts;
  isMoveToTickets: boolean = false;
  ticketStatusForRemove: TicketStatus = null;
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
  count: EventEmitter<number> = new EventEmitter();
  toggleAddTicket: EventEmitter<any> = new EventEmitter();
  typeFilter: EventEmitter<any> = new EventEmitter();
  tagsFilter: EventEmitter<any> = new EventEmitter();
  onGetTicketsStatus: EventEmitter<any> = new EventEmitter();
  leftPanelFilter: EventEmitter<any> = new EventEmitter();
  ticketChangedActions = ['ASSIGNED_USER', 'PRIORITY_CHANGED', 'STATUS', 'TRASH', 'REPORT_AS_SPAM', 'RESTORE_FROM_SPAM', 'TICKET_SHARE', 'MARKED_AS_SPAM', 'EDITED_TICKET'];
  listStatusColor: Array<StatusColor> = [];
  ticketsStatus: Array<TicketStatus> = [];
  constructor(private ticketsRealTimeService: TicketsRealTimeService,
    private ticketsService: TicketsService) { }

  public onInit() {
    this.ticketsRealTimeService.changeActualNumber.subscribe(newChange => {
      if (newChange.action === 'NUMBER_CHANGED' && newChange.data.type === "TICKET") {
        this.onInitActualNumber(newChange.data.numPart);
      }
    })
    this.ticketsRealTimeService.changeTickets.subscribe(newChange => {

      if (newChange.action === 'TICKET_STATUS_REMOVED') {
        let index = this.ticketsStatus.findIndex(item => item.id === newChange.data);
        this.ticketsStatus.splice(index, 1);
        this.onGetTicketsStatus.emit(this.ticketsStatus);
      }
      if (newChange.action === 'TICKET_STATUS_EDITED') {
        let index = this.ticketsStatus.findIndex(item => item.id === newChange.data.id);
        if (index > -1) this.ticketsStatus[index] = new TicketStatus(newChange.data);
        this.onGetTicketsStatus.emit(this.ticketsStatus);
      }
      if (newChange.action === 'TICKET_STATUS_SAVED') {

        this.ticketsStatus.push(new TicketStatus(newChange.data))
        this.onGetTicketsStatus.emit(this.ticketsStatus);
      }

      if (newChange.action === 'CREATED_TICKET') {
        this.addTicket.emit(newChange.data);
      }
      if (this.ticketChangedActions.indexOf(newChange.action) > -1) {
        if (newChange.action !== 'EDITED_TICKET') delete newChange.data.userCompanies;
        this.updateTicket.emit(newChange.data);
      }
      if (newChange.action === 'ALL_TICKETS_COUNT') this.onUpdateCounts(newChange.data);
      if (newChange.action === 'READ') this.changeFieldTicket.emit(new TicketChangeField("unread", newChange.data.id, false));
      if (newChange.action === 'TICKET_UPDATES_READ') this.changeFieldTicket.emit(new TicketChangeField("hasNewUpdates", newChange.data.id, false));
      if (newChange.action === 'TICKET_DELETED') this.removeTicket.emit(newChange.data);
      if (newChange.action === 'TICKET_BILLABLE') this.changeFieldTicket.emit(new TicketChangeField("isBillable", newChange.data.id, newChange.data.isBillable));
      if (newChange.action === 'TICKET_INVOICED') this.changeFieldTicket.emit(new TicketChangeField("hasInvoice", newChange.data.id, newChange.data.hasInvoice));
      if (newChange.action === 'LINKED_AGENT_CHANGED') {
        newChange.data.ticketIds.forEach(item => {
          this.changeFieldTicket.emit(new TicketChangeField("agent.deviceId", item, (newChange.data.deviceId) ? newChange.data.deviceId : null));
        });
      }
      if (newChange.action === 'DISCOUNT_CHANGED') this.changeFieldTicket.emit(new TicketChangeField("discount", newChange.data.id, newChange.data.discount));
    })
    this.ticketsService.getTicketStatus().subscribe((data: any) => {
      this.ticketsStatus = data.map(item => new TicketStatus(item));
      this.onGetTicketsStatus.emit(this.ticketsStatus);
    })

  }
  public getTicketsStatus() {
    return this.ticketsStatus;
  }
  public setTicketStatusForRemove(data) {
    this.ticketStatusForRemove = data;
  }
  public getTicketStatusForRemove() {
    return this.ticketStatusForRemove;
  }

  public getListStatusColor() {
    return this.listStatusColor;
  }
  public getTicketsCounts() {
    return this.ticketsCounts;
  }
  public setIsMoveToTickets(data) {
    this.isMoveToTickets = data;
  }
  public setListType(data) {
    this.listType = data;
  }
  public getCounts(counts) {
    this.ticketsService.getCounts(counts).subscribe(data => {
      this.ticketsCounts = new TicketsCounts(data);
      this.onUpdateCounts(data);
      this.onInitCount(this.ticketsCounts[(this.listType === 'USERS') ? 'USER' : this.listType]);
    })
  }
  public onChangeLeftPanelFilter(data) {
    this.listType = data;
    this.leftPanelFilter.emit(data);
  }
  public getOnChangeLeftPanelFilter() {
    return this.leftPanelFilter;
  }

  public onChangeTagsFilter(data) {
    this.tagsFilter.emit(data);
  }
  public getOnChangeTagsFilter() {
    return this.tagsFilter;
  }
  public getListType() {
    return this.listType;
  }
  public onChangeTypeFilter(data) {
    this.listType = data;
    this.typeFilter.emit(data);
  }
  public getOnChangeTypeFilter() {
    return this.typeFilter;
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
    this.listStatusColor = data;
    this.colorStatus.emit(data);
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
