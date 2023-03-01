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
    private companiesStateService: CompaniesStateService,
    private leftPanelStateService: LeftPanelStateService,
    private ticketsStateService: TicketsStateService) { }

  ngOnInit() {
    /* CAUSTOM LOGIC FOR COUNTS TICKETS - We will need to remove this logic once we will completely remove the angularJS framework. */
    /* START */
    this.ticketsFilter.setListType(this.ticketsStateService.getListType());
    /* END */
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
      this.ticketsFilter = data;
      this.showPreloader = true;
      document.body.querySelector(".main-container").scrollTo(0, 0);
      this.setDefaultScoll();
      this.onScroll();
    })
    this.sub.add(getOnInitFilter);
    if (this.ticketsStateService.getListType()) this.onScroll();
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
      console.log("this.companiesStateService.getCurrentCompany().id", this.companiesStateService.getCurrentCompany().id);
      if (this.companiesStateService.getCurrentCompany().id == ("73221c72-f87c-4519-8235-c4b57ad1cc19" && "72381bff-127c-4a63-9d2e-6e952350dcbd")) {
        this.ticketStateService.setTicketRoutingId(id);
        const url = `/#/${this.companiesStateService.getCurrentCompany().name.replaceAll(' ', '')}/ticket/${id}`;
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
    this.sub.unsubscribe();
  }
  public trackById(index, item) {
    return item.id;
  }
}
