import { Injectable, EventEmitter } from '@angular/core';
import { TicketsRealTimeService } from './tickets-real-time.service';
import { TicketProfile } from '../../components/tickets/tickets/class/ticket-profile';
import { TicketChangeField } from '../../components/tickets/tickets/class/ticket-change-field';
import { WebsocketService } from '../../services/websocket/websocket.service';
import { TicketsService } from '../../services/tickets/tickets.service';
import { TicketsCounts } from '../../components/tickets/tickets/class/tickets-counts';
import { TicketStatus } from 'src/app/components/setting/ticket-settings-page/tickets-status/class/ticket-status';
import { StatusColor } from 'src/app/components/tickets/class/status-color';
import { TicketsFilter } from 'src/app/components/tickets/tickets/class/tickets-filter';
import { TicketGlobalFilter } from 'src/app/components/tickets/tickets/class/ticket-global-filter';
import { TicketsPriority } from 'src/app/components/setting/ticket-settings-page/tickets-priority/class/tickets-priority';
import { Ticket } from 'src/app/components/tickets/class/ticket';

@Injectable({
  providedIn: 'root'
})
export class TicketsStateService {
  listType: string;
  ticketsCounts: TicketsCounts;
  isMoveToTickets: boolean = false;
  ticketStatusForRemove: TicketStatus = null;
  ticketPriorityForRemove: TicketsPriority = null;
  listTicketStatusForRemove: Array<TicketStatus> = [];
  onTicketsPriorities: EventEmitter<any> = new EventEmitter();
  clearFormUpdate: EventEmitter<any> = new EventEmitter();
  onActualNumber: EventEmitter<any> = new EventEmitter();
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
  onInitGlobalFilter: EventEmitter<any> = new EventEmitter();
  onGetGlobalFilters: EventEmitter<any> = new EventEmitter();
  leftPanelFilter: EventEmitter<any> = new EventEmitter();
  onToggleFilter: EventEmitter<any> = new EventEmitter();
  onChangeFilterField: EventEmitter<any> = new EventEmitter();
  onSelectAll: EventEmitter<any> = new EventEmitter();
  ticketChangedActions = ['ASSIGNED_USER', 'PRIORITY_CHANGED', 'STATUS', 'TRASH', 'REPORT_AS_SPAM', 'RESTORE_FROM_SPAM', 'TICKET_SHARE', 'MARKED_AS_SPAM', 'EDITED_TICKET'];
  listStatusColor: Array<StatusColor> = [];
  ticketsStatus: Array<TicketStatus> = [];
  globalFilters: Array<TicketGlobalFilter> = [];
  ticketsFilter: TicketsFilter = new TicketsFilter();
  globalFilterForRemove: TicketGlobalFilter = null;
  ticketsPriorities: Array<TicketsPriority> = [];
  listTicketsPrioritiesForRemove: Array<TicketsPriority> = [];
  ticketsForMerge: Array<Ticket> = [];
  onMegeTickets: EventEmitter<any> = new EventEmitter();
  actualNumber: string;
  constructor(private ticketsRealTimeService: TicketsRealTimeService,
    private ticketsService: TicketsService) { }

  public onInit() {
    this.ticketsRealTimeService.changeTicketPriority.subscribe(newChange => {
      if (newChange.action === 'CUSTOM_PRIORITY_SAVED') this.ticketsPriorities.push(new TicketsPriority(newChange.data));
      if (newChange.action === 'CUSTOM_PRIORITY_EDITED') {
        let index = this.ticketsPriorities.findIndex(item => item.id == newChange.data.id);
        if (index > -1) this.ticketsPriorities[index] = new TicketsPriority(newChange.data);
      }
      if (newChange.action === 'CUSTOM_PRIORITY_REMOVED') {
        let index = this.ticketsPriorities.findIndex(item => item.id == newChange.data);
        if (index > -1) this.ticketsPriorities.splice(index, 1);
      }
      this.onTicketsPriorities.emit(this.ticketsPriorities);
    })
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
    })
    this.ticketsService.getTicketStatus().subscribe((data: any) => {
      this.ticketsStatus = data.map(item => new TicketStatus(item));
      this.onGetTicketsStatus.emit(this.ticketsStatus);
    })
    this.ticketsRealTimeService.changeTicketFilters.subscribe(newChange => {
      if (newChange.action === 'TICKET_FILTER_SAVED') {
        this.globalFilters.unshift(new TicketGlobalFilter(newChange.data))
        this.onGetGlobalFilters.emit(this.globalFilters);
      }
      if (newChange.action === 'TICKET_FILTER_EDITED') {
        let index = this.globalFilters.findIndex(item => item.id === newChange.data.id);
        if (index > -1) this.globalFilters[index] = new TicketGlobalFilter(newChange.data);
        this.onGetGlobalFilters.emit(this.globalFilters);
      }
      if (newChange.action === 'TICKET_FILTER_REMOVED') {
        let index = this.globalFilters.findIndex(item => item.id === newChange.data);
        this.globalFilters.splice(index, 1);
        this.onGetGlobalFilters.emit(this.globalFilters);
      }

    })
  }
  public mergeTicket() {
    this.onMegeTickets.emit(null);
  }
  public addTicketForMerge(data) {
    this.ticketsForMerge.push(data);
  }
  public initSelectAllTickets(data) {
    this.onSelectAll.emit(data);
  }
  public resetSelectedTicketsForMerge() {
    this.ticketsForMerge = [];
  }
  public removeSelectedTicketForMerge(index) {
    this.ticketsForMerge.slice(index, 1)
  }
  public getTicketsForMerge() {
    return this.ticketsForMerge;
  }
  public setTicketsForMerge(data) {
    this.ticketsForMerge = data;
  }
  public changeFilterField(data) {
    this.onChangeFilterField.emit(data);
  }
  public changeToggleFilter(data) {
    this.onToggleFilter.emit(data);
  }
  public getGlobalFilters() {
    return this.globalFilters;
  }
  public setGlobalFilters(data) {
    this.globalFilters = data;
    this.onGetGlobalFilters.emit(this.globalFilters);
  }
  public setGlobalFilterForRemove(data) {
    this.globalFilterForRemove = data;
  }
  public getGlobalFilterForRemove() {
    return this.globalFilterForRemove;
  }
  public onChangeGlobalFilter(data) {
    this.onInitGlobalFilter.emit(data);
  }
  public setListTicketsPrioritiesForRemove(data) {
    this.listTicketsPrioritiesForRemove = data;
  }
  public getListTicketsPrioritiesForRemove() {
    return this.listTicketsPrioritiesForRemove;
  }
  public getTicketsPriorities() {
    return this.ticketsPriorities;
  }
  public setTicketsPriorities(data) {
    this.ticketsPriorities = data;
  }
  public getListTicketStatusForRemove() {
    return this.listTicketStatusForRemove;
  }
  public setListTicketStatusForRemove(data) {
    this.listTicketStatusForRemove = data;
  }
  public getTicketsStatus() {
    return this.ticketsStatus;
  }
  public setTicketPriorityForRemove(data) {
    this.ticketPriorityForRemove = data;
  }
  public getTicketPriorityForRemove() {
    return this.ticketPriorityForRemove;
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
  public getActualNumber() {
    return this.actualNumber;
  }
  public onInitActualNumber(data) {
    this.actualNumber = data;
    this.onActualNumber.emit(data);
  }
  public getTicketsFilter() {
    return this.ticketsFilter;
  }
  public onInitFilter(data) {
    this.ticketsFilter = data;
    this.filter.emit(data);
  }
  public onColorStatus(data) {
    this.listStatusColor = data;
    this.colorStatus.emit(data);
  }
  public onSetTicketsPriorities(data) {
    this.ticketsPriorities = data;
    this.onTicketsPriorities.emit(data);
  }
  public onToggleAddTicket() {
    this.toggleAddTicket.emit(null);
  }
  public onInitCount(data) {
    this.count.emit(data);
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
