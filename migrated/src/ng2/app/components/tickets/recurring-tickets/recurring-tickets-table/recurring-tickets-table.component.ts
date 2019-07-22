import { Component, OnInit, Input } from '@angular/core';
import { RecurringTicket } from '../class/recurring-ticket';
import { MONTHS_SHORT } from 'src/ng2/app/const/date';
import { TicketStateService } from '../../ticket-state.service';
import { RecurringTicketsStateService } from '../services/recurring-tickets-state.service';

@Component({
  selector: 'app-recurring-tickets-table',
  templateUrl: './recurring-tickets-table.component.html',
  styleUrls: ['./recurring-tickets-table.component.scss']
})
export class RecurringTicketsTableComponent implements OnInit {
  @Input() ticket: RecurringTicket;
  constructor(  private recurringState: RecurringTicketsStateService,) { }

  ngOnInit() {
    console.log('ticket',this.ticket);
  }

  public getPareDate(milisecong) {
    let date = new Date(milisecong);
    return `${date.getDate()} ${MONTHS_SHORT[date.getMonth()]} ${date.getFullYear()}`;
  }

  public getParseShortName(name) {
    return `${name[0].toUpperCase()}${name[1].toUpperCase()}`;
  }

  public editTicket () {
    this.recurringState.onInitEditTicket(this.ticket);
  }

}
