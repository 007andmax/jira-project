import { Component, OnInit, Input } from '@angular/core';
import { RecurringTicket } from '../class/recurring-ticket';
import { MONTHS_SHORT } from 'src/app/const/date';

import { RecurringTicketsStateService } from '../services/recurring-tickets-state.service';
import { RecurringService } from 'src/app/services/recurring/recurring.service';



@Component({
  selector: 'app-recurring-tickets-table',
  templateUrl: './recurring-tickets-table.component.html',
  styleUrls: ['./recurring-tickets-table.component.scss']
})
export class RecurringTicketsTableComponent implements OnInit {
  @Input() ticket: RecurringTicket;
  public showSelect = false;

  /**
   * Creates an instance of the RecurringTicketsHeaderComponent with the injected services
   * @param {RecurringTicketsStateService} recurringState to work recurring state
   * @param {RecurringService} recurringService Service to work with recurring tickets
   * 
   */
  constructor(public recurringState: RecurringTicketsStateService, private recurringService: RecurringService,
  ) { }

  ngOnInit() {

  }

  /**
  * Get Date
  * @param milisecong - milisecong date
  */
  public getPareDate(milisecong) {
    let date = new Date(milisecong);
    let startDate = new Date(date.getTime() + (date.getTimezoneOffset() * 60 * 1000) + this.recurringState.getTehCompany().addresses[0].timeZone.timeOffset);
    return `${startDate.getDate()} ${MONTHS_SHORT[startDate.getMonth()]} ${startDate.getFullYear()}`;
  }

  /**
  * Get short name
  * @param name - name ticket
  */
  public getParseShortName(name) {
    return `${name[0].toUpperCase()}${name[1].toUpperCase()}`;
  }

  /**
   * Show model for edit
   */
  public editTicket() {
    this.recurringState.onInitEditTicket(this.ticket);
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

  /**
   * Request for remove ticket
   */
  public removeTicket() {
    this.recurringService.removeTicket(this.ticket.id).subscribe(() => {

    })
  }

  /**
  * Request for suspend ticket
  */
  public suspendTicket() {
    this.recurringService.suspendTicket(this.ticket.id).subscribe(() => {

    })
  }

  /**
  * Request for resume ticket
  */
  public resumeTicket() {
    this.recurringService.resumeTicket(this.ticket.id).subscribe(() => {

    })
  }

  public trackByIndex(index, item) {
    return index;
  }

}
