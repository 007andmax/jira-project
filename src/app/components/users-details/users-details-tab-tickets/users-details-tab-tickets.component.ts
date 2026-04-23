import { CommonModule } from '@angular/common';
import { UsersDetailsTabTicketsItemComponent } from './src/app/services/modal/modal-session-screen/modal-session-screen.component.ts';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { TicketsListService } from '../../tickets/tickets/services/tickets-list.service';
import { User } from '../../users/class/user';
import { TicketsFilter } from '../../tickets/tickets/class/tickets-filter';
import { Ticket } from '../../tickets/class/ticket';
import { Subscription } from 'rxjs';
import { StatusColor } from '../../tickets/class/status-color';
import { TicketStatus } from '../../setting/ticket-settings-page/tickets-status/class/ticket-status';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { AppService } from 'src/app/states/app/app.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { TicketsStateService } from 'src/app/states/tickets/tickets-state.service';
import { TicketStateService } from '../../tickets/tickets/ticket-edit-aside/services/ticket-state.service';

@Component({
  standalone: true,
  imports: [CommonModule, UsersDetailsTabTicketsItemComponent],
    selector: 'app-users-details-tab-tickets',
    templateUrl: './users-details-tab-tickets.component.html',
    styleUrls: ['./users-details-tab-tickets.component.scss'],
    providers: [TicketsListService],
    standalone: true
})
export class UsersDetailsTabTicketsComponent implements OnInit {
  user: User;
  ticketsFilter: TicketsFilter = new TicketsFilter();
  @Input() set setUser(value) {
    this.user = value;
    this.ticketsFilter.setUsers([this.user]);
  };
  showPreloader: boolean = true;
  public infiniteScrollDisabled = true;
  public page_number: number = 0;
  tickets: Array<Ticket> = [];
  sub: Subscription = new Subscription();
  listColors: Array<StatusColor> = [];
  offset: number = 15;
  showPendingPreloader: boolean = false;
  ticketsStatus: Array<TicketStatus> = [];
  constructor(private ticketsService: TicketsService,
    private ticketsListService: TicketsListService,
    private ticketStateService: TicketStateService,
    public cd: ChangeDetectorRef,
    private appService: AppService,
    private companiesStateService: CompaniesStateService,
    private ticketsStateService: TicketsStateService) { }

  ngOnInit() {
    this.ticketsFilter.setListType("ALL");
    if (this.getWidth() >= 1920) {
      this.offset = 25;
      this.ticketsFilter.setSize(25);
    }
    if (this.getWidth() >= 3200) {
      this.offset = 35;
      this.ticketsFilter.setSize(35);
    }
    this.listColors = this.ticketsStateService.getListStatusColor();

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
    this.sub.add(getOnRemoveTicket);
    this.onScroll();
    let getOnInitColor = this.ticketsStateService.getOnInitColor().subscribe(data => {
      this.listColors = data;
    })
    this.sub.add(getOnInitColor);
    this.ticketsStatus = this.ticketsStateService.getTicketsStatus();
    let onGetTicketsStatus = this.ticketsStateService.onGetTicketsStatus.subscribe(data => {
      this.ticketsStatus = data;
    })
    this.sub.add(onGetTicketsStatus);
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
    this.ticketStateService.setTicketRoutingId(id);
    const url = `/#/${this.companiesStateService.getCurrentCompany().techDomain}/ticket/${id}`;
    window.open(url, '_blank');
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
