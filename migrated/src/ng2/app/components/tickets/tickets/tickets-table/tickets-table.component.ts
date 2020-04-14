import { Component, OnInit, OnDestroy } from '@angular/core';
import { TicketsService } from 'src/ng2/app/services/tickets/tickets.service';
import { TicketsFilter } from '../class/tickets-filter';
import { TicketsListService } from '../services/tickets-list.service';
import { Ticket } from '../../class/ticket';
import { TicketsStateService } from 'src/ng2/app/states/tickets/tickets-state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tickets-table',
  templateUrl: './tickets-table.component.html',
  styleUrls: ['./tickets-table.component.scss'],
  providers: [TicketsListService]
})
export class TicketsTableComponent implements OnInit,OnDestroy {
  ticketsFilter: TicketsFilter = new TicketsFilter();
  showPreloader: boolean = true;
  public infiniteScrollDisabled = false;
  public page_number: number = 0;
  tickets: Array<Ticket> = [];
  sub:Subscription = new Subscription();
  constructor(private ticketsService: TicketsService,
    private ticketsListService: TicketsListService,
    private ticketsStateService: TicketsStateService) { }

  ngOnInit() {
   let getOnInitFilter = this.ticketsStateService.getOnInitFilter().subscribe(data => {
      this.ticketsFilter = data;
      this.showPreloader = true;
      console.log("this.ticketsFilter",this.ticketsFilter);
      this.setDefaultScoll();
      this.onScroll();
    })
    this.sub.add(getOnInitFilter);
    this.onScroll();
    

  }
  private getTickets() {
    if (this.ticketsListService.getBlockList()) {
      this.infiniteScrollDisabled = false;
      return;
    }
    this.ticketsFilter.setOffset(this.page_number * 15);
    this.ticketsService.getTickets(this.ticketsFilter.getListTupe(), this.ticketsFilter.getDataForRequest()).subscribe((data: Array<Ticket>) => {
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
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
  public trackById(index, item) {
    return item.id;
  }
}
