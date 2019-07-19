import { Component, OnInit } from '@angular/core';
import { RecurringService } from 'src/ng2/app/services/recurring/recurring.service';
import { RecurringTicket } from './class/recurring-ticket';

@Component({
  selector: 'app-recurring-tickets',
  templateUrl: './recurring-tickets.component.html',
  styleUrls: ['./recurring-tickets.component.scss']
})
export class RecurringTicketsComponent implements OnInit {
public page_number:number = 0;
public items_per_page:number = 30;
public sort:string = 'company_name';
public infiniteScrollDisabled = false;
public direction:string = 'ASC';
public ticketList:Array<RecurringTicket> = [];
  constructor(
    private recurringService: RecurringService,
  ) { }

  ngOnInit() {
    this.getTicket();
  }

   
  public getTicket() {
    this.recurringService.getTicketsList(this.page_number,this.items_per_page,this.sort,this.direction).subscribe((res: Array<RecurringTicket>) => {
      this.ticketList = [...this.ticketList, ...res];
      this.page_number += 1;
      this.infiniteScrollDisabled = false;
    })
  }

  public trackById(index, item) {
    return item.id;
  }
}
