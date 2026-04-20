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
    providers: [TicketsListService],
    standalone: true
})
export class TicketsFilterSearchComponent implements OnInit {
  page_number: number = 0;
  offset: number = 30;
  showPreloader: boolean = true;
  public infiniteScrollDisabled = true;
  @Input() ticketsFilter: TicketsFilter = new TicketsFilter();
  @ViewChild('globalSearch', { static: true }) globalSearch: NgbDropdown;
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
  /**
* @description Set id seleted ticket and routing to ticket details page
* @param {Ticket} item - Object of Ticket
*/
  selectTicket(item) {
    this.ticketStateService.setTicketRoutingId(item.id);
    const url = `/#/${this.companiesStateService.getCurrentCompany().techDomain}/ticket/${item.id}`;
    window.open(url, '_blank');
  }
  /**
* @description Preparation to get ticket by name
*/
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
  }
  /**
* @description Init request to get filter list tickets
*/
  private getTickets() {
    if (this.ticketsListService.getBlockList()) {
      this.infiniteScrollDisabled = false;
      return;
    }
    this.ticketsFilter.setSize(30);
    if (this.page_number > 0) this.showPreloader = true;
    this.ticketsService.getTickets(this.ticketsFilter.getListTupe(), this.ticketsFilter.getDataForRequest()).subscribe((data: Array<Ticket>) => {
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
  /**
* @description Init logic to scroll list ticket
*/
  public onScroll() {
    this.infiniteScrollDisabled = true;
    this.getTickets();
  }
  /**
* @description Init request to get filter list tickets
*/
  public setDefaultScoll() {
    this.page_number = 0;
    this.ticketsListService.setBlockList(false);
    this.list = [];

  }
  /**
* @description Show dropdown
*/
  onShowDropDown() {
    if (this.word.length > 0) this.globalSearch.open();
  }
  /**
* @description Clear values "word" and "list"
*/
  clearWord() {
    this.word = "";
    this.list = [];
    this.ticketsFilter.setSearchText("");
  }
  /**
 * @description Track list by "id" field, retrun field "id"
 * @param {Number} index - selected 
 * @param {Object} item - Object for use tracking
 * @returns {String} This is the result
 */
  public trackById(index, item) {
    return item.id;
  }
}
