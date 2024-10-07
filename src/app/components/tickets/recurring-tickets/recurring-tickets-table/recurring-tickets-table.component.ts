import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { RecurringTicket } from '../class/recurring-ticket';
import { MONTHS_SHORT } from 'src/app/const/date';
import { RecurringTicketsStateService } from '../services/recurring-tickets-state.service';
import { RecurringService } from 'src/app/services/recurring/recurring.service';
import { TicketsListService } from '../../tickets/services/tickets-list.service';
import { AddAssignedUserComponent } from '../../tickets/ticket-edit-aside/add-assigned-user/add-assigned-user.component';



@Component({
  selector: 'app-recurring-tickets-table',
  templateUrl: './recurring-tickets-table.component.html',
  styleUrls: ['./recurring-tickets-table.component.scss'],

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
  constructor(public recurringState: RecurringTicketsStateService,
    private recurringService: RecurringService,
  ) { }

  ngOnInit() {

  }
  getStyleNetAvatar(i) {
    return `${12 * i}px`;
  }
  /**
  * Get Date
  * @param milisecong - milisecong date
  */
  public getPareDate(milisecong) {
    let date = new Date(milisecong);
    let startDate = new Date(date.getTime() + (date.getTimezoneOffset() * 60 * 1000) + this.recurringState.getTechCompany().addresses[0].timeZone.timeOffset);
    return `${startDate.getDate()} ${MONTHS_SHORT[startDate.getMonth()]} ${startDate.getFullYear()}`;
  }

  getAssignedUserNameForAvatar(user) {
    if (!user) return '';
    if (!user.avatar) return `${(user.firstName) ? user.firstName[0].toUpperCase() : ''}${(user.lastName) ? user.lastName[0].toUpperCase() : ''}`;
    return '';
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
    this.stopEvent($event);
    this.showSelect = !this.showSelect;

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
  public trackById(index, item) {
    return item.id;
  }
}
