import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { TicketsListService } from '../tickets/tickets/services/tickets-list.service';
import { TicketsFilter } from '../tickets/tickets/class/tickets-filter';
import { Ticket } from '../tickets/class/ticket';
import { Subscription } from 'rxjs';
import { StatusColor } from '../left-panel/left-panel-tickets/tickets-status/class/status-color';
import { TicketsColor } from '../left-panel/left-panel-tickets/tickets-status/class/tickets-color';
import { TicketsService } from '../../services/tickets/tickets.service';
import { TicketsStateService } from '../../states/tickets/tickets-state.service';
import { CompaniesStateService } from '../../states/company/companies-state.service';
import { LeftPanelStateService } from '../../states/left-panel/left-panel-state.service';
import { TicketsHeaderComponent } from '../tickets/tickets/tickets-header/tickets-header.component';
import { LeftPanelService } from '../../services/left-panel/left-panel.service';

@Component({
  selector: 'company-tickets',
  templateUrl: './company-tickets.component.html',
  styleUrls: ['./company-tickets.component.scss'],
  providers: [TicketsListService]
})
export class CompanyTicketsComponent implements OnInit, OnDestroy {
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
  @ViewChild('header') header: TicketsHeaderComponent;
  constructor(private ticketsService: TicketsService,
    private ticketsListService: TicketsListService,
    public cd: ChangeDetectorRef,
    private leftPanelService: LeftPanelService,
    private companiesStateService: CompaniesStateService,
    private ticketsStateService: TicketsStateService) { }

  ngOnInit() {

    this.leftPanelService.getColors().subscribe((data: any) => {

      let listColors = data.map(item => {
        return new StatusColor(item.backgroundColor, item.borderColor);
      })
      this.ticketsStateService.onColorStatus(listColors);

    })
    this.leftPanelService.getTicketsStatus().subscribe((data: any) => {

      let ticketsColor = new TicketsColor(data);
      this.ticketsStateService.onInitStatus(ticketsColor);
    })
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

    this.ticketsStateService.getOnInitColor().subscribe(data => {
      this.listColors = data;
    })
    this.ticketsStateService.getOnInitStatus().subscribe(data => {
      this.statusColor = data;
    })
    this.header.setTitle("All Tickets");
    if (localStorage.getItem('company_id')) {
      let ticket_id = localStorage.getItem('company_id');
      let company = this.companiesStateService.getCompanies().find(item => item.id === ticket_id);
      this.header.filter.setTypeFilterWithoutChange("ALL");
      this.header.filter.companyDp.editItem = company;
      this.header.filter.ticketsFilter.setCompany(company);
      this.header.filter.onChangeCounterFilter();
      this.ticketsFilter.setListType("ALL");
      this.ticketsFilter.setCompany(company);

      this.getCount();
      this.onScroll();
    }
  }
  private getCount() {
    this.ticketsService.getCount(this.ticketsFilter.getDataForRequest()).subscribe(data => {
      this.ticketsStateService.onInitCount(data);
      this.header.setTitle("All Tickets");
    })
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
      if (!this.cd['destroyed']) {
        this.cd.detectChanges();
      }


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
