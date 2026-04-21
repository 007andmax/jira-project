
import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { TicketsListService } from '../tickets/tickets/services/tickets-list.service';
import { TicketsFilter } from '../tickets/tickets/class/tickets-filter';
import { Ticket } from '../tickets/class/ticket';
import { Subscription } from 'rxjs';
import { TicketsService } from '../../services/tickets/tickets.service';
import { TicketsStateService } from '../../states/tickets/tickets-state.service';
import { CompaniesStateService } from '../../states/company/companies-state.service';
import { LeftPanelStateService } from '../../states/left-panel/left-panel-state.service';
import { TicketsHeaderComponent } from '../tickets/tickets/tickets-header/tickets-header.component';
import { LeftPanelService } from '../../services/left-panel/left-panel.service';
import { TicketStateService } from '../tickets/tickets/ticket-edit-aside/services/ticket-state.service';
import { UsersStateService } from '../../states/users/users-state.service';
import { ActivatedRoute } from '@angular/router';
import { TicketStatus } from '../setting/ticket-settings-page/tickets-status/class/ticket-status';
import { StatusColor } from '../tickets/class/status-color';
import { TicketsFilterComponent } from '../tickets/tickets/tickets-header/tickets-filter/tickets-filter.component';
import { fadeInAnimation } from 'src/app/animations';
import { MergeTicketsComponent } from '../tickets/tickets/merge-tickets/merge-tickets.component';
import { TicketsTableItemComponent } from '../tickets/tickets/tickets-table/tickets-table-item/tickets-table-item.component';

@Component({
  standalone: true,
  imports: [MergeTicketsComponent, TicketsTableItemComponent, CommonModule],
  selector: 'company-tickets',
  templateUrl: './company-tickets.component.html',
  styleUrls: ['./company-tickets.component.scss'],
  animations: [fadeInAnimation],
  // attach the fade in animation to the host (root) element of this component
  host: { '[@fadeInAnimation]': '' },
  providers: [TicketsListService],
  standalone: true
})
export class CompanyTicketsComponent implements OnInit, OnDestroy {
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
  @ViewChild('header', { static: true }) header: TicketsHeaderComponent;
  @ViewChild('filter', { static: true }) filter: TicketsFilterComponent;
  ticketsStatus: Array<TicketStatus> = [];
  container = document.body.querySelector(".main-container");
  isInitTickets: boolean = false;
  toggleFilter: boolean = false;
  constructor(private ticketsService: TicketsService,
    private ticketsListService: TicketsListService,
    public cd: ChangeDetectorRef,
    private ticketStateService: TicketStateService,
    private leftPanelService: LeftPanelService,
    private usersStateService: UsersStateService,
    public activateRoute: ActivatedRoute,
    private companiesStateService: CompaniesStateService,
    private leftPanelStateService: LeftPanelStateService,
    private ticketsStateService: TicketsStateService) { }

  ngOnInit() {
    document.body.querySelector(".main-container").scrollTo(0, 0);
    this.leftPanelStateService.changeStateWithoutNavigate('company-tickets');
    this.ticketsStateService.setListType("ALL");
    this.ticketStateService.getOnTicketClosed().subscribe(data => {
      this.idEditTicket = '';
    });
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
    let getOnAddTicket = this.ticketsStateService.getOnAddTicket().subscribe(data => {
      if (this.ticketsListService.isTicketMatchesFilters(this.ticketsFilter, data) && !this.tickets.find(item => item.id == data.id) && !(this.page_number == 0 && this.showPreloader)) {
        this.tickets.unshift(new Ticket(data));
      }
    })
    this.sub.add(getOnAddTicket);
    let getOnUpdateTicket = this.ticketsStateService.getOnUpdateTicket().subscribe(data => {
      let ticket = new Ticket(data);
      if (data.assignedUser) ticket.setAssignedUserId(data.assignedUser.id);
      let findIndex = this.tickets.findIndex(item => item.id === ticket.id);
      if (this.ticketsListService.isTicketMatchesFilters(this.ticketsFilter, data)) {
        if (findIndex > -1) this.tickets[findIndex] = ticket;
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
    let getOnInitFilter = this.ticketsStateService.getOnInitFilter().subscribe(data => {
      this.ticketsFilter = data;
      this.showPreloader = true;
      document.body.querySelector(".main-container").scrollTo(0, 0);
      this.setDefaultScoll();
      this.onScroll();
    })
    this.sub.add(getOnInitFilter);
    let getOnInitColor = this.ticketsStateService.getOnInitColor().subscribe(data => {
      this.listColors = data;
    })
    this.sub.add(getOnInitColor);
    this.header.setTitle("All Tickets");
    if (this.companiesStateService.getCompanies().length > 0 && this.activateRoute.snapshot.params['id'] && this.usersStateService.getAllUsers().length > 0) this.setCompanyRoutingId(this.activateRoute.snapshot.params['id']);
    let getOnCompanies = this.companiesStateService.getOnCompanies().subscribe((data) => {
      if (this.companiesStateService.getCompanies().length > 0 && this.activateRoute.snapshot.params['id'] && this.usersStateService.getAllUsers().length > 0) this.setCompanyRoutingId(this.activateRoute.snapshot.params['id']);
    })
    this.sub.add(getOnCompanies);
    let getOnUsers = this.usersStateService.getOnUsers().subscribe((data) => {
      if (this.companiesStateService.getCompanies().length > 0 && this.activateRoute.snapshot.params['id'] && this.usersStateService.getAllUsers().length > 0) this.setCompanyRoutingId(this.activateRoute.snapshot.params['id']);
    })
    this.sub.add(getOnUsers);
    let id = this.activateRoute.snapshot.params['id'];
    if (id) this.companiesStateService.setCompanyRoutingId(id);
    let subscription = this.activateRoute.params.subscribe(params => {
      this.showPreloader = true;
      id = params['id'];
      if (id) this.companiesStateService.setCompanyRoutingId(id);
      if (this.companiesStateService.getCompanies().length > 0 && this.activateRoute.snapshot.params['id'] && this.usersStateService.getAllUsers().length > 0) this.setCompanyRoutingId(this.activateRoute.snapshot.params['id']);
    });
    this.sub.add(subscription);
    this.ticketsStatus = this.ticketsStateService.getTicketsStatus();
    let onGetTicketsStatus = this.ticketsStateService.onGetTicketsStatus.subscribe(data => {
      this.ticketsStatus = data;
    })
    this.sub.add(onGetTicketsStatus);
    let onToggleFilter = this.ticketsStateService.onToggleFilter.subscribe(data => {
      this.toggleFilter = data;
    })
    this.sub.add(onToggleFilter);
  }
  onToggleFilter(data) {
    this.ticketsStateService.changeToggleFilter(data);
  }
  onFilter(data) {
    this.ticketsStateService.changeFilterField(data);
  }
  private getCount() {
    this.ticketsService.getCount(this.ticketsFilter.getDataForRequest()).subscribe(data => {
      this.ticketsStateService.onInitCount(data);
      this.header.setTitle("All Tickets");
    })
  }
  setCompanyRoutingId(id) {
    if (this.isInitTickets) return;
    this.isInitTickets = true;
    let ticket_id = id;
    let company = this.companiesStateService.getCompanies().find(item => item.id === ticket_id);
    this.filter.setTypeFilterWithoutChange("ALL");
    this.filter.companyDp.isDisabled = true;
    this.filter.companyDp.selectedItems = [company];
    this.filter.companyDp.removable = false;
    this.filter.ticketsFilter.setCompanies([company]);
    this.filter.globalFilter.setClientCompaies([company.id]);
    this.filter.onChangeCounterFilter();
    this.ticketsFilter.setListType("ALL");
    this.ticketsFilter.setCompanies([company]);
    this.ticketsFilter.isDisbledCompany = true;
    this.header.ticketsFilter = this.ticketsFilter;
    this.header.onChangeCounterFilter();
    this.filter.onGetUsers();
    this.getCount();
    this.onScroll();
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
    this.ticketsFilter.setSize(30);
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
    this.companiesStateService.setCompanyRoutingId(null);
  }
  public trackById(index, item) {
    return item.id;
  }

}
