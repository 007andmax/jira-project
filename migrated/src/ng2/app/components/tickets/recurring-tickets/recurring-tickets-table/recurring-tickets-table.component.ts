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
  public showSelect = false;
  constructor(private recurringState: RecurringTicketsStateService, ) { }

  ngOnInit() {
    console.log('ticket', this.ticket);
  }

  public getPareDate(milisecong) {
    let date = new Date(milisecong);
    return `${date.getDate()} ${MONTHS_SHORT[date.getMonth()]} ${date.getFullYear()}`;
  }

  public getParseShortName(name) {
    return `${name[0].toUpperCase()}${name[1].toUpperCase()}`;
  }

  public editTicket() {
    this.recurringState.onInitEditTicket(this.ticket);
  }
  public trackByIndex(index, item) {
    return index;
  }
  /**
 * show selecct wrapper
 */
  public showSelectWrapper($event) {
    this.showSelect = !this.showSelect;
    this.stopEvent($event);
  }

  /**
   * stop event
   */
  private stopEvent($event) {
    $event.preventDefault();
    $event.stopPropagation();
  }

  public getTypeCron(cron: string) {
   if (cron.match(/\d+ \d+ \d+ 1\/\d+ \* [\?\*] \*/)) {
      return "Daily";
    } else if (cron.match(/\d+ \d+ \d+ [\?\*] \* MON-FRI \*/)) {
      return  "Daily";
    } else if (cron.match(/\d+ \d+ \d+ [\?\*] \* (MON|TUE|WED|THU|FRI|SAT|SUN)(,(MON|TUE|WED|THU|FRI|SAT|SUN))* \*/)) {
      return  "Weekly";
    } else if (cron.match(/\d+ \d+ \d+ (\d+|L|LW|1W) 1\/\d+ [\?\*] \*/)) {
      return  "Monthly";
    } else if (cron.match(/\d+ \d+ \d+ [\?\*] 1\/\d+ (MON|TUE|WED|THU|FRI|SAT|SUN)((#[1-5])|L) \*/)) {
      return  "Monthly";
    } 
    return "";
  }

}
