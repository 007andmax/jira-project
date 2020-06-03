import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { TicketsService } from 'src/ng2/app/services/tickets/tickets.service';
import { TicketsFilter } from '../class/tickets-filter';
import { TicketsListService } from '../services/tickets-list.service';
import { Ticket } from '../../class/ticket';
import { TicketsStateService } from 'src/ng2/app/states/tickets/tickets-state.service';
import { Subscription } from 'rxjs';
import { StatusColor } from '../../../left-panel/left-panel-tickets/tickets-status/class/status-color';
import { TicketsColor } from '../../../left-panel/left-panel-tickets/tickets-status/class/tickets-color';


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
  constructor(private ticketsService: TicketsService,
    private ticketsListService: TicketsListService,
    public cd: ChangeDetectorRef,
    private ticketsStateService: TicketsStateService) { }

  ngOnInit() {
    this.ticketsStateService.getOnAddTicket().subscribe(data => {
      if (this.ticketsListService.isTicketMatchesFilters(this.ticketsFilter, data)) {
        this.tickets.unshift(data);
      }
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
  }

  editTicket(id) {
    this.ticketsStateService.onOpenTicket();
    this.ticketsService.getTicket(id).subscribe(data => {
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
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
  public trackById(index, item) {
    return item.id;
  }
}
