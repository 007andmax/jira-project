import { Component, Input, OnInit } from '@angular/core';
import { TicketsStateService } from 'src/app/states/tickets/tickets-state.service';
import { TicketGlobalFilter } from '../../class/ticket-global-filter';

@Component({
  selector: 'tickets-filter-info',
  templateUrl: './tickets-filter-info.component.html',
  styleUrls: ['./tickets-filter-info.component.scss']
})
export class TicketsFilterInfoComponent implements OnInit {
  @Input() title: string;
  globalFilter: TicketGlobalFilter = new TicketGlobalFilter();
  constructor(private ticketsStateService: TicketsStateService,) { }

  ngOnInit() {
    let onInitGlobalFilter = this.ticketsStateService.onInitGlobalFilter.subscribe((data: TicketGlobalFilter) => {
      console.log("data", data);
      this.globalFilter = data;
    });
  }

}
