import { Component, OnInit } from '@angular/core';

import { TicketStateService } from "../../ticket-state.service";

@Component({
  selector: 'app-recurring-tickets-header',
  templateUrl: './recurring-tickets-header.component.html',
  styleUrls: ['./recurring-tickets-header.component.scss']
})
export class RecurringTicketsHeaderComponent implements OnInit {

  constructor(
    private ticketStateService: TicketStateService
  ) { }

  ngOnInit() {
  }

  public showTicketRecurringAside() {
    this.ticketStateService.toggleTicketRecurringAside();
  }

}
