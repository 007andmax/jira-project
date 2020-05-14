import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { TicketsService } from 'src/ng2/app/services/tickets/tickets.service';
import { TicketsFilter } from '../class/tickets-filter';
import { TicketsListService } from '../services/tickets-list.service';
import { Ticket } from '../../class/ticket';
import { TicketsStateService } from 'src/ng2/app/states/tickets/tickets-state.service';
import { Subscription } from 'rxjs';
import { StatusColor } from '../../../left-panel/left-panel-tickets/tickets-status/class/status-color';
import { TicketsColor } from '../../../left-panel/left-panel-tickets/tickets-status/class/tickets-color';
import { TicketsCounts } from '../class/tickets-counts';
import { UsersStateService } from 'src/ng2/app/states/users/users-state.service';

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

  constructor(private ticketsService: TicketsService,
    private ticketsListService: TicketsListService,
    public cd: ChangeDetectorRef,
    private ticketsStateService: TicketsStateService) { }

  ngOnInit() {
    this.ticketsStateService.getOnAddTicket().subscribe(data => {
      console.log("data", data);
    
      if (this.ticketsListService.isTicketMatchesFilters(this.ticketsFilter, data)) {
       
        this.tickets.unshift(data);
      }
    })
    this.ticketsStateService.getOnUpdateTicket().subscribe(data => {
      console.log("data", data);

      let ticket = new Ticket(data);
      let findIndex = this.tickets.findIndex(item => item.id === ticket.id);
      if (this.ticketsListService.isTicketMatchesFilters(this.ticketsFilter, data)) {
       if (findIndex > -1)   this.tickets[findIndex] = data;
      } else {
        if (findIndex > -1)   this.tickets.splice(findIndex,1);
      }
    })
    let getOnInitFilter = this.ticketsStateService.getOnInitFilter().subscribe(data => {
      this.ticketsFilter = data;
      this.showPreloader = true;
      console.log("this.ticketsFilter", this.ticketsFilter);
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

  }

  editTicket(id) {
    this.ticketsStateService.onOpenTicket();
    this.ticketsService.getTicket(id).subscribe(data => {
      console.log("data", data);
      this.ticketsStateService.onEditTicket(data);
    })
  }
  private getTickets() {
    if (this.ticketsListService.getBlockList()) {
      this.infiniteScrollDisabled = false;
      return;
    }
    this.ticketsFilter.setOffset(this.page_number * this.offset);
    this.ticketsService.getTickets(this.ticketsFilter.getListTupe(), this.ticketsFilter.getDataForRequest()).subscribe((data: Array<Ticket>) => {
      console.log("data", data);

      this.tickets = [...this.tickets, ...data];
      this.infiniteScrollDisabled = false;
      if (data.length < this.offset) this.ticketsListService.setBlockList(true);
      this.page_number += 1;
      this.showPreloader = false;
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
