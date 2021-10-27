import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { TicketsFilter } from '../class/tickets-filter';
import { TicketsListService } from '../services/tickets-list.service';
import { Ticket } from '../../class/ticket';
import { TicketsStateService } from 'src/app/states/tickets/tickets-state.service';
import { Subscription } from 'rxjs';
import { StatusColor } from '../../../left-panel/left-panel-tickets/tickets-status/class/status-color';
import { TicketsColor } from '../../../left-panel/left-panel-tickets/tickets-status/class/tickets-color';
import { TicketStateService } from '../ticket-edit-aside/services/ticket-state.service';
import { TicketStatus } from 'src/app/components/setting/customizable-lists/class/ticket-status';


@Component({
  selector: 'app-tickets-table',
  templateUrl: './tickets-table.component.html',
  styleUrls: ['./tickets-table.component.scss'],
  providers: [TicketsListService]
})
export class TicketsTableComponent implements OnInit, OnDestroy {
  ticketsFilter: TicketsFilter = new TicketsFilter();
  showPreloader: boolean = true;
  public infiniteScrollDisabled = true;
  public page_number: number = 0;
  tickets: Array<Ticket> = [];
  sub: Subscription = new Subscription();
  listColors: Array<StatusColor> = [];
  statusColor: TicketsColor;
  offset: number = 15;
  showPendingPreloader: boolean = false;
  idEditTicket: string = '';
  ticketsStatus: Array<TicketStatus> = [];
  constructor(private ticketsService: TicketsService,
    private ticketsListService: TicketsListService,
    private ticketStateService: TicketStateService,
    public cd: ChangeDetectorRef,
    private ticketsStateService: TicketsStateService) { }

  ngOnInit() {
    /* CAUSTOM LOGIC FOR COUNTS TICKETS - We will need to remove this logic once we will completely remove the angularJS framework. */
    /* START */
    this.ticketsFilter.setListType(this.ticketsStateService.getListType());
    /* END */
    this.ticketsStateService.getOnAddTicket().subscribe(data => {
      if (this.ticketsListService.isTicketMatchesFilters(this.ticketsFilter, data)) {
        this.tickets.unshift(data);
        this.cd.detectChanges();
      }
    })
    this.ticketStateService.getOnTicketClosed().subscribe(data => {
      this.idEditTicket = '';
    })
    this.ticketsStateService.getOnUpdateTicket().subscribe(data => {
      let ticket = new Ticket(data);
      if (data.assignedUser) ticket.setAssignedUserId(data.assignedUser.id);
      let findIndex = this.tickets.findIndex(item => item.id === ticket.id);
      if (this.ticketsListService.isTicketMatchesFilters(this.ticketsFilter, data)) {
        if (findIndex > -1) this.tickets[findIndex] = data;
      } else {
        if (findIndex > -1) this.tickets.splice(findIndex, 1);
      }
      this.cd.detectChanges();
    })

    this.ticketsStateService.getOnRemoveTicket().subscribe(data => {
      let findIndex = this.tickets.findIndex(item => item.id === data.id);
      if (findIndex > -1) this.tickets.splice(findIndex, 1);
    });

    let getOnInitFilter = this.ticketsStateService.getOnInitFilter().subscribe(data => {
      this.ticketsFilter = data;
      this.showPreloader = true;
      window.scrollTo(0, 0);
      this.setDefaultScoll();
      this.onScroll();
    })
    this.sub.add(getOnInitFilter);
    this.onScroll();
    this.ticketsStateService.getOnInitColor().subscribe(data => {
      this.listColors = data;
    })
    this.ticketsStateService.getOnInitStatus().subscribe(data => {
      this.statusColor = data;
    })
    if (localStorage.getItem('billable_ticket_id')) {
      this.editTicket(localStorage.getItem('billable_ticket_id'));
      localStorage.removeItem('billable_ticket_id');
    }
    this.ticketsStatus = this.ticketsStateService.getTicketsStatus();
    let onGetTicketsStatus = this.ticketsStateService.onGetTicketsStatus.subscribe(data => {
      this.ticketsStatus = data;
    })
    this.sub.add(onGetTicketsStatus);
  }

  editTicket(id) {
    this.idEditTicket = id;
    let ticket = this.tickets.find(item => item.id === id);
    this.ticketsStateService.onOpenTicket();
    this.ticketsService.getTicket(id).subscribe(data => {
      data.setUserCompanies(ticket.userCompanies);
      this.ticketsStateService.onEditTicket(data);
    })
  }
  private getTickets() {
    if (this.ticketsListService.getBlockList()) {
      this.infiniteScrollDisabled = false;
      return;
    }
    this.ticketsFilter.setOffset(this.page_number * this.offset);


    if (this.page_number > 0) this.showPendingPreloader = true;
    this.ticketsService.getTickets(this.ticketsFilter.getListTupe(), this.ticketsFilter.getDataForRequest()).subscribe((data: Array<Ticket>) => {
      this.tickets = [...this.tickets, ...data];
      this.infiniteScrollDisabled = false;
      if (data.length < this.offset) this.ticketsListService.setBlockList(true);
      this.page_number += 1;
      this.showPreloader = false;
      this.showPendingPreloader = false;
      this.cd.detectChanges();

    })
  }
  public onScroll() {
    this.infiniteScrollDisabled = true;
    if (this.ticketsFilter.listType !== "RECURRING_TICKETS") this.getTickets();

  }
  public setDefaultScoll() {
    this.page_number = 0;
    this.ticketsListService.setBlockList(false);
    this.tickets = [];
  }
  onAddTicket() {
    this.ticketsStateService.onToggleAddTicket();
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
  public trackById(index, item) {
    return item.id;
  }
}
