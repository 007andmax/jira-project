import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';
import { StatusColor } from 'src/app/components/left-panel/left-panel-tickets/tickets-status/class/status-color';
import { TicketsColor } from 'src/app/components/left-panel/left-panel-tickets/tickets-status/class/tickets-color';
import { Ticket } from 'src/app/components/tickets/class/ticket';
import { TicketsFilter } from 'src/app/components/tickets/tickets/class/tickets-filter';
import { TicketsListService } from 'src/app/components/tickets/tickets/services/tickets-list.service';
import { TicketStateService } from 'src/app/components/tickets/tickets/ticket-edit-aside/services/ticket-state.service';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { TicketsStateService } from 'src/app/states/tickets/tickets-state.service';
import { User } from '../../class/user';

@Component({
  selector: 'users-aside-detail-tickets',
  templateUrl: './users-aside-detail-tickets.component.html',
  styleUrls: ['./users-aside-detail-tickets.component.scss'],
  providers: [TicketsListService]
})
export class UsersAsideDetailTicketsComponent implements OnInit {
  user: User;
  ticketsFilter: TicketsFilter = new TicketsFilter();
  @Input() set setUser(value) {
    this.user = value;
    this.ticketsFilter.setUser(this.user);
  };
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
    private ticketStateService: TicketStateService,
    public cd: ChangeDetectorRef,
    private ticketsStateService: TicketsStateService) { }

  ngOnInit() {
    console.log("getWidth", this.getWidth());

    if (this.getWidth() >= 1920) {
      this.offset = 25;
      this.ticketsFilter.setSize(25);
    }
    if (this.getWidth() >= 3200) {
      this.offset = 35;
      this.ticketsFilter.setSize(35);
    }
    this.ticketsFilter.setListType("ALL");
    this.listColors = this.ticketsStateService.getListStatusColor();
    this.statusColor = this.ticketsStateService.getTicketsColor();
    let getOnAddTicket = this.ticketsStateService.getOnAddTicket().subscribe(data => {
      if (this.ticketsListService.isTicketMatchesFilters(this.ticketsFilter, data)) {
        this.tickets.unshift(data);
        this.cd.detectChanges();
      }
    })
    this.sub.add(getOnAddTicket);

    let getOnUpdateTicket = this.ticketsStateService.getOnUpdateTicket().subscribe(data => {
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
    this.sub.add(getOnUpdateTicket);

    let getOnRemoveTicket = this.ticketsStateService.getOnRemoveTicket().subscribe(data => {
      let findIndex = this.tickets.findIndex(item => item.id === data.id);
      if (findIndex > -1) this.tickets.splice(findIndex, 1);
    });

    this.onScroll();
    this.ticketsStateService.getOnInitColor().subscribe(data => {
      this.listColors = data;
    })
    this.ticketsStateService.getOnInitStatus().subscribe(data => {
      this.statusColor = data;
    })

  }
  getWidth() {
    return Math.max(
      document.body.scrollWidth,
      document.documentElement.scrollWidth,
      document.body.offsetWidth,
      document.documentElement.offsetWidth,
      document.documentElement.clientWidth
    );
  }
  editTicket(id) {
    let ticket = this.tickets.find(item => item.id === id);
    this.ticketsStateService.onOpenTicket();
    this.ticketsService.getTicket(id).subscribe(data => {
      data.setUserCompanies(ticket.userCompanies);
      this.ticketsStateService.onEditTicket(data);
      (<any>document.body.querySelector(".ticket-edit-aside")).style.zIndex = "2";
      (<any>document.body.querySelector(".user-aside-detail-page__aside")).style.zIndex = "1";

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
    this.showPreloader = true;
    this.cd.detectChanges();
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
  public trackById(index, item) {
    return item.id;
  }

}
