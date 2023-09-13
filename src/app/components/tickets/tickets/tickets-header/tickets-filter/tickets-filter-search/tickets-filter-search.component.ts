import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { Ticket } from 'src/app/components/tickets/class/ticket';
import { TicketsFilter } from '../../../class/tickets-filter';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { TicketStateService } from '../../../ticket-edit-aside/services/ticket-state.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { TicketsListService } from '../../../services/tickets-list.service';

@Component({
  selector: 'tickets-filter-search',
  templateUrl: './tickets-filter-search.component.html',
  styleUrls: ['./tickets-filter-search.component.scss'],
  providers: [TicketsListService]
})
export class TicketsFilterSearchComponent implements OnInit {
  page_number: number = 0;
  offset: number = 30;
  showPreloader: boolean = true;
  public infiniteScrollDisabled = true;
  @Input() ticketsFilter: TicketsFilter = new TicketsFilter();
  @ViewChild('globalSearch') globalSearch: NgbDropdown;
  @Output() changeTypeFilter = new EventEmitter();
  word: string = "";
  list: Array<Ticket> = [];
  constructor(private ticketsService: TicketsService,
    public companiesStateService: CompaniesStateService,
    private ticketsListService: TicketsListService,
    public cd: ChangeDetectorRef,
    private ticketStateService: TicketStateService) { }

  ngOnInit() {
  }
  selectTicket(item) {
    this.ticketStateService.setTicketRoutingId(item.id);
    const url = `/#/${this.companiesStateService.getCurrentCompany().techDomain}/ticket/${item.id}`;
    window.open(url, '_blank');
  }
  onSearch() {
    if (this.word.length == 0) {
      this.ticketsFilter.setSearchText("");
      this.list = [];
      return;
    }
    this.changeTypeFilter.emit("ALL");
    this.ticketsFilter.setSearchText(this.word);
    this.setDefaultScoll();
    this.onScroll();

    /*  this.ticketsService.getTickets(this.ticketsFilter.getListTupe(), this.ticketsFilter.getDataForRequest()).subscribe((data: Array<Ticket>) => {
        this.list = data;
        this.onShowDropDown();
      })*/
  }
  private getTickets() {
    console.log("this.ticketsListService.getBlockList()", this.ticketsListService.getBlockList());
    if (this.ticketsListService.getBlockList()) {
      this.infiniteScrollDisabled = false;
      return;
    }
    this.ticketsFilter.setSize(30);
    if (this.page_number > 0) this.showPreloader = true;
    this.ticketsService.getTickets(this.ticketsFilter.getListTupe(), this.ticketsFilter.getDataForRequestTwo()).subscribe((data: Array<Ticket>) => {
      this.list = [...this.list, ...data];
      this.infiniteScrollDisabled = false;
      if (data.length < this.offset) this.ticketsListService.setBlockList(true);
      this.page_number += 1;
      this.ticketsFilter.setOffset(this.page_number * this.offset);
      this.showPreloader = false;
      this.onShowDropDown();
      this.cd.detectChanges();
    })
  }
  public onScroll() {
    console.log("onScroll");
    this.infiniteScrollDisabled = true;
    this.getTickets();
  }
  public setDefaultScoll() {
    this.page_number = 0;
    this.ticketsListService.setBlockList(false);
    this.list = [];

  }
  onShowDropDown() {
    if (this.word.length > 0) this.globalSearch.open();
  }
  clearWord() {
    this.word = "";
    this.list = [];
    this.ticketsFilter.setSearchText("");
  }
}
