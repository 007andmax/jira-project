import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { TicketsFilter } from '../class/tickets-filter';
import { TicketsListService } from '../services/tickets-list.service';
import { Ticket } from '../../class/ticket';
import { TicketsStateService } from 'src/app/states/tickets/tickets-state.service';
import { Subscription } from 'rxjs';
import { TicketStateService } from '../ticket-edit-aside/services/ticket-state.service';
import { TicketStatus } from 'src/app/components/setting/ticket-settings-page/tickets-status/class/ticket-status';
import { StatusColor } from '../../class/status-color';
import { AppService } from 'src/app/states/app/app.service';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';
import { Router } from '@angular/router';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { WebsocketService } from 'src/app/services/websocket/websocket.service';
import { TicketsRealTimeService } from 'src/app/states/tickets/tickets-real-time.service';
import { LeftPanelService } from 'src/app/services/left-panel/left-panel.service';


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
  offset: number = 30;
  showPendingPreloader: boolean = false;
  idEditTicket: string = '';
  ticketsStatus: Array<TicketStatus> = [];
  container = document.body.querySelector(".main-container");
  constructor(private ticketsService: TicketsService,
    private ticketsListService: TicketsListService,
    private ticketStateService: TicketStateService,
    public cd: ChangeDetectorRef,
    private appService: AppService,
    private router: Router,
    private leftPanelService: LeftPanelService,
    private companiesStateService: CompaniesStateService,
    private leftPanelStateService: LeftPanelStateService,
    private usersStateService: UsersStateService,
    private customerPortalStateService: CustomerPortalStateService,
    private websocketService: WebsocketService,
    private ticketsRealTimeService: TicketsRealTimeService,
    private ticketsStateService: TicketsStateService) { }

  ngOnInit() {
    if (this.customerPortalStateService.isCustomerPortal) {
      this.ticketsFilter.setListType("ALL");
      this.ticketsFilter.setFilter(JSON.parse(JSON.stringify(this.customerPortalStateService.getTicketsFilter())));
      this.onScroll();
      this.websocketService.onInitConnectCustomerUser("new-tickets", this.customerPortalStateService.getTicketsFilter().selectedCompany.id);
    } else {
      /* CAUSTOM LOGIC FOR COUNTS TICKETS - We will need to remove this logic once we will completely remove the angularJS framework. */
      /* START */
      this.ticketsFilter.setListType(this.ticketsStateService.getListType());
      if (this.ticketsStateService.getListType()) this.onScroll();
      /* END */
    }
    let onTicketFilters = this.customerPortalStateService.onTicketFilters.subscribe(data => {
      console.log("onTicketFilters");
      this.ticketsFilter.setListType("ALL");
      this.ticketsFilter.setFilter(JSON.parse(JSON.stringify(this.customerPortalStateService.getTicketsFilter())));
      this.showPreloader = true;
      document.body.querySelector(".main-container").scrollTo(0, 0);
      this.setDefaultScoll();
      this.onScroll();
    });
    this.sub.add(onTicketFilters);

    this.ticketsStateService.getOnAddTicket().subscribe(data => {
      if (this.ticketsListService.isTicketMatchesFilters(this.ticketsFilter, data) && !this.tickets.find(item => item.id == data.id) && !(this.page_number == 0 && this.showPreloader)) {
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
      console.log("getOnInitFilter");
      this.ticketsFilter = data;
      this.showPreloader = true;
      document.body.querySelector(".main-container").scrollTo(0, 0);
      this.setDefaultScoll();
      this.onScroll();
    })
    this.sub.add(getOnInitFilter);
    if (this.ticketsStateService.getListStatusColor().length === 0) {
      this.leftPanelService.getColors().subscribe((data: any) => {
        this.listColors = data.map(item => {
          return new StatusColor(item.borderColor, item.textColor);
        })
        this.ticketsStateService.onColorStatus(this.listColors);
      })
    } else {
      this.listColors = this.ticketsStateService.getListStatusColor();
    }
    this.ticketsStateService.getOnInitColor().subscribe(data => {
      this.listColors = data;
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
    if (!this.appService.isMobile) {
      this.ticketStateService.setTicketRoutingId(id);
      const url = `/#/${this.companiesStateService.getCurrentCompany().techDomain}/ticket/${id}`;
      window.open(url, '_blank');
    } else {
      this.idEditTicket = id;
      let ticket = this.tickets.find(item => item.id === id);
      this.ticketsStateService.onOpenTicket();
      this.ticketsService.getTicket(id).subscribe(data => {
        data.setUserCompanies(ticket.userCompanies);
        this.ticketsStateService.onEditTicket(data);
      })
    }
  }
  private getTickets() {
    console.log("getTickets");
    if (this.ticketsListService.getBlockList()) {
      this.infiniteScrollDisabled = false;
      return;
    }
    this.ticketsFilter.setOffset(this.page_number * this.offset);
    this.ticketsFilter.setSize(30);
    //this.ticketsFilter.onSetSizeAll();

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
    if (this.customerPortalStateService.isCustomerPortal && this.ticketsRealTimeService.subsribeToTicketsCustomerUser) this.ticketsRealTimeService.subsribeToTicketsCustomerUser.unsubscribe();
    this.sub.unsubscribe();
  }
  public trackById(index, item) {
    return item.id;
  }
}
