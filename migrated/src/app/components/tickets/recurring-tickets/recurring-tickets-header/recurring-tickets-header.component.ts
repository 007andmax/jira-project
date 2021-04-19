import { Component, OnInit } from '@angular/core';
import { RecurringTicketsStateService } from '../services/recurring-tickets-state.service';


@Component({
  selector: 'app-recurring-tickets-header',
  templateUrl: './recurring-tickets-header.component.html',
  styleUrls: ['./recurring-tickets-header.component.scss']
})
export class RecurringTicketsHeaderComponent implements OnInit {

  /**
   * Creates an instance of the RecurringTicketsHeaderComponent with the injected services
   * @param {RecurringTicketsStateService} ticketStateService to work recurring state
   * 
   */
  constructor(
    private ticketStateService: RecurringTicketsStateService
  ) { }

  ngOnInit() {
  }

   /**
   * Show modal for create ticket
   */
  public showTicketAddRecurringAside() {
    this.ticketStateService.toggleTicketAddRecurringAside();
  }

}
