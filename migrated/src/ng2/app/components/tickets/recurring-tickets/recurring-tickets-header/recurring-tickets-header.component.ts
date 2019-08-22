import { Component, OnInit } from '@angular/core';
import { RecurringTicketsStateService } from '../services/recurring-tickets-state.service';


@Component({
  selector: 'app-recurring-tickets-header',
  templateUrl: './recurring-tickets-header.component.html',
  styleUrls: ['./recurring-tickets-header.component.scss']
})
export class RecurringTicketsHeaderComponent implements OnInit {

  constructor(
    private ticketStateService: RecurringTicketsStateService
  ) { }

  ngOnInit() {
  }

  public showTicketAddRecurringAside() {
    this.ticketStateService.toggleTicketAddRecurringAside();
  }

}
