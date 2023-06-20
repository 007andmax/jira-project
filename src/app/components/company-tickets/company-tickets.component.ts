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
import { AppService } from 'src/app/states/app/app.service';

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
  offset: number = 30;
  showPendingPreloader: boolean = false;
  idEditTicket: string = '';
  @ViewChild('header') header: TicketsHeaderComponent;
  ticketsStatus: Array<TicketStatus> = [];
  container = document.body.querySelector(".main-container");
  isInitTickets: boolean = false;
  constructor(private ticketsService: TicketsService,
    private ticketsListService: TicketsListService,
    public cd: ChangeDetectorRef,
    private ticketStateService: TicketStateService,
    private leftPanelService: LeftPanelService,
    private usersStateService: UsersStateService,
    public activateRoute: ActivatedRoute,
    private appService: AppService,
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
    this.ticketsStateService.getOnAddTicket().subscribe(data => {
      if (this.ticketsListService.isTicketMatchesFilters(this.ticketsFilter, data) && !this.tickets.find(item => item.id == data.id) && !(this.page_number == 0 && this.showPreloader)) {
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
      document.body.querySelector(".main-container").scrollTo(0, 0);
      this.setDefaultScoll();
      this.onScroll();
    })
    this.sub.add(getOnInitFilter);

    this.ticketsStateService.getOnInitColor().subscribe(data => {
      this.listColors = data;
    })

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
    this.header.filter.setTypeFilterWithoutChange("ALL");
    this.header.filter.companyDp.isDisabled = true;
    this.header.filter.companyDp.editItem = company;
    this.header.filter.ticketsFilter.setCompany(company);
    this.header.filter.onChangeCounterFilter();
    this.ticketsFilter.setListType("ALL");
    this.ticketsFilter.setCompany(company);
    this.header.filter.onGetUsers(this.usersStateService.getAllUsers().filter(user => user.company.id === company.id));
    this.getCount();
    this.onScroll();
  }
  editTicket(id) {
    if (!this.appService.isMobile) {
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
