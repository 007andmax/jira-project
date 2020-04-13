import { Component, OnInit } from '@angular/core';
import { TicketsService } from 'src/ng2/app/services/tickets/tickets.service';
import { TicketsFilter } from '../class/tickets-filter';
import { TicketsListService } from '../services/tickets-list.service';
import { Ticket } from '../../class/ticket';

@Component({
  selector: 'app-tickets-table',
  templateUrl: './tickets-table.component.html',
  styleUrls: ['./tickets-table.component.scss'],
  providers: [TicketsListService]
})
export class TicketsTableComponent implements OnInit {
  ticketsFilter: TicketsFilter = new TicketsFilter();
  showPreloader: boolean = true;
  public infiniteScrollDisabled = false;
  public page_number: number = 0;
  tickets = [];
  constructor(private ticketsService: TicketsService,
    private ticketsListService: TicketsListService) { }

  ngOnInit() {

    this.onScroll();

  }
  private getTickets() {
    if (this.ticketsListService.getBlockList()) {
      this.infiniteScrollDisabled = false;
      return;
    }
    this.ticketsService.getTickets(this.ticketsFilter.getListTupe(), this.ticketsFilter.getDataForRequest()).subscribe((data:Array<Ticket>) => {
      console.log("data", data);

      this.tickets = [...this.tickets, ...data];
      this.infiniteScrollDisabled = false;
      if (data.length > 15) this.ticketsListService.setBlockList(true);
      this.page_number += 1;
      this.showPreloader = false;
    })
  }
  public onScroll() {
    this.infiniteScrollDisabled = true;
    this.getTickets();

  }
  public setDefaultScoll() {
    this.page_number = 0;
    this.ticketsListService.setBlockList(false);
    this.tickets = [];
  }
  public trackById(index, item) {
    return item.id;
  }
}
