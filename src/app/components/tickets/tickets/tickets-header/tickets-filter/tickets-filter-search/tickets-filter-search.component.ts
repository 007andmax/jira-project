import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { Ticket } from 'src/app/components/tickets/class/ticket';
import { TicketsFilter } from '../../../class/tickets-filter';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { TicketStateService } from '../../../ticket-edit-aside/services/ticket-state.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';

@Component({
  selector: 'tickets-filter-search',
  templateUrl: './tickets-filter-search.component.html',
  styleUrls: ['./tickets-filter-search.component.scss']
})
export class TicketsFilterSearchComponent implements OnInit {
  @Input() ticketsFilter: TicketsFilter = new TicketsFilter();
  @ViewChild('globalSearch') globalSearch: NgbDropdown;
  @Output() changeTypeFilter = new EventEmitter();
  word: string = "";
  list: Array<Ticket> = [];
  constructor(private ticketsService: TicketsService,
    public companiesStateService: CompaniesStateService,
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
      this.list = [];
      return;
    }
    this.changeTypeFilter.emit("ALL");
    this.ticketsFilter.setSearchText(this.word);
    this.ticketsService.getTickets(this.ticketsFilter.getListTupe(), this.ticketsFilter.getDataForRequest()).subscribe((data: Array<Ticket>) => {
      this.list = [...this.list, ...data];
      this.onShowDropDown();
    })
  }
  onShowDropDown() {
    if (this.word.length > 0) this.globalSearch.open();
  }
  clearWord() {
    this.word = "";
    this.list = [];
  }
}
