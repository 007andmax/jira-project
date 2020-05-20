import { Component, OnInit } from '@angular/core';
import { RecurringService } from 'src/ng2/app/services/recurring/recurring.service';
import { RecurringTicket } from './class/recurring-ticket';
import { RecurringTicketsListService } from './services/recurring-tickets-list.service';
import { RecurringTicketsRealTimeService } from './services/recurring-tickets-real-time.service';

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
  public infiniteScrollDisabled = true;
  public direction: string = 'ASC';
  public showPreloader: boolean = true;
  public ticketList: Array<RecurringTicket> = [];

  /**
   * Creates an instance of the RecurringTicketsComponent with the injected services
   * @param {RecurringService} recurringService Service to work with recurring tickets
   * @param {RecurringTicketsListService} listSerivce Service to work with recurring tickets
   * @param {RecurringTicketsRealTimeService} recurringTicketsRealTimeService Service to work with real time recurring tickets
   * 
   */
  constructor(
    private recurringService: RecurringService,
    private listSerivce: RecurringTicketsListService,
    private recurringTicketsRealTimeService: RecurringTicketsRealTimeService

  ) { }

  /**
   * Initializes recurring ticket. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  ngOnInit() {
    this.getTicket();
    this.changeTicketListItem();

  }

  /**
 * Get ticker
 */
  public getTicket() {
   
    if (this.listSerivce.getBlockList()) {
      this.infiniteScrollDisabled = false;
      return;
    }
    this.recurringService.getTicketsList(this.page_number, this.items_per_page, this.sort, this.direction).subscribe((res: Array<RecurringTicket>) => {
      if (res.length < 30) this.listSerivce.setBlockList(true);
      this.ticketList = [...this.ticketList, ...res];
      this.page_number += 1;
      this.showPreloader = false;
      this.infiniteScrollDisabled = false;
    })
  }

  /**
 * Subscribe to chacnge real time
 */
  public changeTicketListItem() {
    this.recurringTicketsRealTimeService.changeQuotesArray.subscribe((newChange) => {
      if (newChange.action === 'RECURRING_TICKET_CREATED') {
       
        return this.ticketList = [newChange.data,...this.ticketList];
      }
      
      if (newChange.action === 'RECURRING_TICKET_DELETED') {
        const elemIndex = this.ticketList.findIndex((item) => item.id === newChange.data.id);
        return this.ticketList.splice(elemIndex,1);
      }
      if (newChange.action === 'RECURRING_TICKET_SUSPENDED' || newChange.action === 'RECURRING_TICKET_RESUMED' || newChange.action === 'RECURRING_TICKET_EDITED') {
        const elemIndex = this.ticketList.findIndex((item) => item.id === newChange.data.id);
        return this.ticketList[elemIndex] = newChange.data;
      }
      
    })
  }

  /**
 * Scroll
 */
  public onScroll() {
    this.infiniteScrollDisabled = true;
    this.getTicket();

  }

  /**
 * Sort 
 * @param sort - type sort
 */
  public sortBy(sort) {
    this.direction = this.listSerivce.getDirection(this.direction, this.sort, sort);
    this.sort = sort;
    this.refreshTicketList();
    this.getTicket();
  }

  /**
 * Refresh ticket list
 */
  private refreshTicketList() {
    this.page_number = 0;
    this.ticketList = [];
    this.showPreloader = true;
  }

  public trackById(index, item) {
    return item.id;
  }
}
