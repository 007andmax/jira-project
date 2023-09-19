import { ChangeDetectorRef, Component, ElementRef, Input, OnInit } from '@angular/core';
import { TicketsListService } from '../../../services/tickets-list.service';
import * as moment from "moment";
import { TicketsFilter } from '../../../class/tickets-filter';
import { Company } from 'src/app/interfaces/company/company';
import { Ticket } from 'src/app/interfaces/quote/ticket';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { AppService } from 'src/app/states/app/app.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { TicketsStateService } from 'src/app/states/tickets/tickets-state.service';
import { CurrentUser } from 'src/class/current-user/current-user';
import { TicketStateService } from '../../../ticket-edit-aside/services/ticket-state.service';
@Component({
  selector: 'ticket-detail-contact-details-history',
  templateUrl: './ticket-detail-contact-details-history.component.html',
  styleUrls: ['./ticket-detail-contact-details-history.component.scss'],
  providers: [TicketsListService]
})
export class TicketDetailContactDetailsHistoryComponent implements OnInit {

  ticketsFilter: TicketsFilter = new TicketsFilter();

  @Input() user: CurrentUser;
  @Input() company: Company;
  showPreloader: boolean = true;
  lastUserId: string = '';
  lastCompanyId: string = '';
  public infiniteScrollDisabled = true;
  public page_number: number = 0;
  tickets: Array<Ticket> = [];
  offset: number = 15;
  showPendingPreloader: boolean = false;
  constructor(private ticketsListService: TicketsListService,
    private ticketsService: TicketsService,
    private elRef: ElementRef,
    private ticketsStateService: TicketsStateService,
    private appService: AppService,
    private ticketStateService: TicketStateService,
    private companiesStateService: CompaniesStateService,
    public cd: ChangeDetectorRef,) { }

  ngOnInit() {

  }
  public setUser(data) {
    this.user = data;
  }
  public setCompany(data) {
    this.company = data;
  }
  public onInitGetTickets() {
    if (this.company && this.user && this.lastCompanyId !== this.company.id && this.lastUserId !== this.user.id) {
      this.lastCompanyId = this.company.id;
      this.lastUserId = this.user.id;
    } else {
      return;
    }
    this.ticketsFilter.setCompanies([this.company]);
    this.ticketsFilter.setUsers([this.user]);
    this.showPreloader = true;
    this.elRef.nativeElement.querySelector('.company-info-aside__history').scrollTo(0, 0);
    this.setDefaultScoll();
    this.onScroll();
  }
  public setDefaultScoll() {
    this.page_number = 0;
    this.ticketsListService.setBlockList(false);
    this.tickets = [];
  }
  public onScroll() {
    this.infiniteScrollDisabled = true;
    this.getTickets();

  }
  editTicket(id) {
    if (!this.appService.isMobile) {
      this.ticketStateService.setTicketRoutingId(id);
      const url = `/#/${this.companiesStateService.getCurrentCompany().name.replaceAll(' ', '')}/ticket/${id}`;
      window.open(url, '_blank');
    } else {
      this.ticketsStateService.onOpenTicket();
      this.ticketsService.getTicket(id).subscribe(data => {
        this.ticketsStateService.onEditTicket(data);
      })
    }
  }
  getCreateAt(createdAt) {
    let date = new Date(createdAt);

    return moment(date).format('DD MMM YYYY')
  }
  public getTickets() {
    if (this.ticketsListService.getBlockList()) {
      this.infiniteScrollDisabled = false;
      return;
    }
    this.ticketsFilter.setListType("ALL");
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
  public trackById(index, item) {
    return item.id;
  }

}
