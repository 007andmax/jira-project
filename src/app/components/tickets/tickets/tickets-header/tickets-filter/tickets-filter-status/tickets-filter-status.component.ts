import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TicketStatusFilter } from '../../class/ticket-status-filter';

@Component({
    selector: 'tickets-filter-status',
    templateUrl: './tickets-filter-status.component.html',
    styleUrls: ['./tickets-filter-status.component.scss'],
    standalone: true
})
export class TicketsFilterStatusComponent implements OnInit {
  @Input() ticketsStatus: Array<TicketStatusFilter> = [];
  @Output() onSelectStatus = new EventEmitter();
  public shortVersion: boolean = true;
  constructor() { }

  ngOnInit() {
    this.shortVersion = this.ticketsStatus.length > 5;
  }
  /**
* @description Track list by "id" field, retrun field "id"
* @param {Number} index - selected 
* @param {Object} item - Object for use tracking
* @returns {String} This is the result
*/
  public trackById(index, item) {
    return item.id;
  }
  /**
* @description Init Output event selected status
* @param {TicketStatusFilter} item - selected item
* @param {Object} event - Object from input 
*/
  selectStatus(item, event) {
    this.onSelectStatus.emit({ item, event })
  }
}
