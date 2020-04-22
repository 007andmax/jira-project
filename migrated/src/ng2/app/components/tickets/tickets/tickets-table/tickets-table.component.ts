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
    private usersStateService: UsersStateService,
    private ticketsStateService: TicketsStateService) { }

  ngOnInit() {
    this.ticketsStateService.getOnAddTicket().subscribe(data => {
      console.log("data",data);
      if (this.isTicketMatchesFilters(data)) {
       
        this.tickets.unshift(data);
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
  isTicketMatchesFilters(ticket: Ticket) {
    console.log("this.ticketsFilter.listType",this.ticketsFilter.listType);
    console.log("ticket", ticket);
    if (this.ticketsFilter.listType === "ALL" && ticket.ticketSource !== "FROM_RECURRING_TICKET") return true;
    if (this.ticketsFilter.listType === "UNASSIGNED" && ticket.status === null) return true;
    if (this.ticketsFilter.listType === "OPEN" && ticket.status !== "COMPLETED") return true;
    if (this.ticketsFilter.listType === "USERS") {
      if (ticket.assignedUserId === this.usersStateService.getCurrentUser().id) {
        return true;
      } else if (this.checkUserInMultiAssigned(ticket.multiAssignedUsers)) {
        return true;
      } else if (ticket.status === null) {
        return true;
      }
    }
    if (this.ticketsFilter.listType === "RECURRING_TICKETS_OPEN" && ticket.ticketSource === "FROM_RECURRING_TICKET" && ticket.status === "IN_PROGRESS") return true;
    return false;
  }
  checkUserInMultiAssigned(multiAssignedUsers) {
    let find = multiAssignedUsers.find(item => item.id === this.usersStateService.getCurrentUser().id);
    return (find) ? true : false;
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
