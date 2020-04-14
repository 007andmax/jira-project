import { Component, OnInit } from '@angular/core';
import { TicketsFilter } from '../../tickets/tickets/class/tickets-filter';
import { TicketsStateService } from 'src/ng2/app/states/tickets/tickets-state.service';

@Component({
  selector: 'app-left-panel-tickets',
  templateUrl: './left-panel-tickets.component.html',
  styleUrls: ['./left-panel-tickets.component.scss']
})
export class LeftPanelTicketsComponent implements OnInit {
  ticketsFilter: TicketsFilter = new TicketsFilter();
  listType:string = "USERS";
  constructor(private ticketsStateService: TicketsStateService) { }

  ngOnInit() {
  }
  setTypeFilter(type) {
    this.listType = type;
    this.ticketsFilter.setListType(type);
    this.ticketsStateService.onInitFilter(this.ticketsFilter);
  }
}
