import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TicketsFilter } from '../../../class/tickets-filter';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { Ticket } from '../../../../class/ticket';
import { TicketProfile } from '../../../class/ticket-profile';
import * as moment from "moment";
import { Company } from 'src/app/interfaces/company/company';
import { TicketsListService } from '../../../services/tickets-list.service';
import { TicketStateService } from '../../../ticket-edit-aside/services/ticket-state.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';

@Component({
  selector: 'ticket-detail-tickets-details',
  templateUrl: './ticket-detail-tickets-details.component.html',
  styleUrls: ['./ticket-detail-tickets-details.component.scss'],
  providers: [TicketsListService]
})
export class TicketDetailTicketsDetailsComponent implements OnInit {
  ticketsFilter: TicketsFilter = new TicketsFilter();
  @Input() ticketProfile: TicketProfile = new TicketProfile();
  showPreloader: boolean = true;
  public infiniteScrollDisabled = true;
  public page_number: number = 0;
  tickets: Array<Ticket> = [];
  offset: number = 15;
  container: string;
  showPendingPreloader: boolean = false;
  @Output() onClose = new EventEmitter<any>();
  constructor(private ticketsService: TicketsService,
    public cd: ChangeDetectorRef,
    private elRef: ElementRef,
    private ticketStateService: TicketStateService,
    private companiesStateService: CompaniesStateService,
    private ticketsListService: TicketsListService,) { }
  ngOnInit(): void {
    this.container = this.elRef.nativeElement.querySelector(".ticket-detail-tickets__body");
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
    this.ticketStateService.setTicketRoutingId(id);
    const url = `/#/${this.companiesStateService.getCurrentCompany().name.replaceAll(' ', '')}/ticket/${id}`;
    window.open(url, '_blank');
  }
  getCreateAt(createdAt) {
    return moment(new Date(createdAt)).format('DD MMM YYYY')
  }
  public getTickets() {
    if (this.ticketsListService.getBlockList()) {
      this.infiniteScrollDisabled = false;
      return;
    }
    this.ticketsFilter.setListType("ALL");
    this.ticketsFilter.setOffset(this.page_number * this.offset);
    this.ticketsFilter.setCompanies([this.ticketProfile.company]);
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
  close() {
    this.onClose.emit(null);
  }
  public trackById(index, item) {
    return item.id;
  }
}
