import { Component, OnInit } from '@angular/core';
import { RecurringService } from 'src/app/services/recurring/recurring.service';
import { RecurringTicket } from './class/recurring-ticket';
import { RecurringTicketsListService } from './services/recurring-tickets-list.service';
import { RecurringTicketsRealTimeService } from './services/recurring-tickets-real-time.service';
import { fadeInAnimation } from 'src/app/animations';
import { TicketSortBy } from '../tickets/class/ticket-sort-by';

@Component({
  selector: 'app-recurring-tickets',
  templateUrl: './recurring-tickets.component.html',
  styleUrls: ['./recurring-tickets.component.scss'],
  animations: [fadeInAnimation],
  // attach the fade in animation to the host (root) element of this component
  host: { '[@fadeInAnimation]': '' },
  providers: [RecurringTicketsListService]
})
export class RecurringTicketsComponent implements OnInit {
  public page_number: number = 0;
  public items_per_page: number = 30;
  public infiniteScrollDisabled = true;
  public showPreloader: boolean = true;
  public ticketList: Array<RecurringTicket> = [];
  sortBy: TicketSortBy = new TicketSortBy('company_name', 'ASC');
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
    this.recurringService.getTicketsList(this.page_number, this.items_per_page, this.sortBy.sortBy, this.sortBy.sortDirection).subscribe((res: Array<RecurringTicket>) => {
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

        return this.ticketList = [newChange.data, ...this.ticketList];
      }

      if (newChange.action === 'RECURRING_TICKET_DELETED') {
        const elemIndex = this.ticketList.findIndex((item) => item.id === newChange.data.id);
        return this.ticketList.splice(elemIndex, 1);
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
  public setSortBy(sort) {
    document.body.querySelector(".main-container").scrollTo(0, 0);
    this.sortBy.sortDirection = this.listSerivce.getDirection(this.sortBy.sortDirection, this.sortBy.sortBy, sort);
    this.sortBy.sortBy = sort;
    this.refreshTicketList();
    this.getTicket();
  }

  /**
 * Refresh ticket list
 */
  private refreshTicketList() {
    this.listSerivce.setBlockList(false);
    this.page_number = 0;
    this.ticketList = [];
    this.showPreloader = true;
  }

  public trackById(index, item) {
    return item.id;
  }
}
