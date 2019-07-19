import { Component, OnInit } from '@angular/core';
import { RecurringService } from 'src/ng2/app/services/recurring/recurring.service';
import { RecurringTicket } from './class/recurring-ticket';
import { RecurringTicketsListService } from './services/recurring-tickets-list.service';

@Component({
  selector: 'app-recurring-tickets',
  templateUrl: './recurring-tickets.component.html',
  styleUrls: ['./recurring-tickets.component.scss'],
  providers: [RecurringTicketsListService]
})
export class RecurringTicketsComponent implements OnInit {
  public page_number: number = 0;
  public items_per_page: number = 30;
  public sort: string = 'company_name';
  public infiniteScrollDisabled = false;
  public direction: string = 'ASC';
  public showPreloader: boolean = true;
  public ticketList: Array<RecurringTicket> = [];
  constructor(
    private recurringService: RecurringService,
    private listSerivce: RecurringTicketsListService

  ) { }

  ngOnInit() {
    this.getTicket();
  }


  public getTicket() {
    this.recurringService.getTicketsList(this.page_number, this.items_per_page, this.sort, this.direction).subscribe((res: Array<RecurringTicket>) => {
      this.ticketList = [...this.ticketList, ...res];
      this.page_number += 1;
      this.showPreloader = false;

      this.infiniteScrollDisabled = false;
    })
  }


  public onScroll() {
    console.log('onScroll');
    this.infiniteScrollDisabled = true;

  }
  public sortBy(sort) {
    this.direction = this.listSerivce.getDirection(this.direction, this.sort, sort);
    this.sort = sort;
    this.refreshTicketList();
    this.getTicket();
  }

  private refreshTicketList() {
    this.page_number = 0;
    this.ticketList = [];
    this.showPreloader = true;
  }

  public trackById(index, item) {
    return item.id;
  }
}
