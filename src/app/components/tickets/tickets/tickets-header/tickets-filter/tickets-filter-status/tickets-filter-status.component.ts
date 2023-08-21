import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TicketStatusFilter } from '../../class/ticket-status-filter';

@Component({
  selector: 'tickets-filter-status',
  templateUrl: './tickets-filter-status.component.html',
  styleUrls: ['./tickets-filter-status.component.scss']
})
export class TicketsFilterStatusComponent implements OnInit {
  @Input() ticketsStatus: Array<TicketStatusFilter> = [];
  @Output() onSelectStatus = new EventEmitter();
  public shortVersion: boolean = true;
  constructor() { }

  ngOnInit() {
    this.shortVersion = this.ticketsStatus.length > 5;
  }
  public trackById(index, item) {
    return item.id;
  }
  selectStatus(item, event) {
    this.onSelectStatus.emit({ item, event })
  }
}
