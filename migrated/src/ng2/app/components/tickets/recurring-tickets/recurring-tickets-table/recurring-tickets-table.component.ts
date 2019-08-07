import { Component, OnInit, Input } from '@angular/core';
import { RecurringTicket } from '../class/recurring-ticket';
import { MONTHS_SHORT } from 'src/ng2/app/const/date';
import { TicketStateService } from '../../ticket-state.service';
import { RecurringTicketsStateService } from '../services/recurring-tickets-state.service';
import { RecurringService } from 'src/ng2/app/services/recurring/recurring.service';



@Component({
  selector: 'app-recurring-tickets-table',
  templateUrl: './recurring-tickets-table.component.html',
  styleUrls: ['./recurring-tickets-table.component.scss']
})
export class RecurringTicketsTableComponent implements OnInit {
  @Input() ticket: RecurringTicket;
  public showSelect = false;
  constructor(public recurringState: RecurringTicketsStateService, private recurringService: RecurringService) { }

  ngOnInit() {
    console.log('ticket', this.ticket);
  }

  public getPareDate(milisecong) {
    let date = new Date(milisecong);
   // console.log('date',date);
          
     let startDate = date.getTime() + (date.getTimezoneOffset() * 60 * 1000) + this.recurringState.getTehCompany().addresses[0].timeZone.timeOffset;
    
   // console.log('this.startDate', new Date(startDate));
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

  public removeTicket() {
    this.recurringService.removeTicket(this.ticket.id).subscribe(() => {

    })
  }
  public suspendTicket () {
    this.recurringService.suspendTicket(this.ticket.id).subscribe(() => {

    })
  }
  public resumeTicket () {
    this.recurringService.resumeTicket(this.ticket.id).subscribe(() => {

    })
  }
 

}
