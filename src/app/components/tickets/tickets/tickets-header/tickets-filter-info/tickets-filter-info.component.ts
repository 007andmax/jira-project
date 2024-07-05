import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TicketsStateService } from 'src/app/states/tickets/tickets-state.service';
import { TicketGlobalFilter } from '../../class/ticket-global-filter';
import { Subscription } from 'rxjs';

@Component({
  selector: 'tickets-filter-info',
  templateUrl: './tickets-filter-info.component.html',
  styleUrls: ['./tickets-filter-info.component.scss']
})
export class TicketsFilterInfoComponent implements OnInit, OnDestroy {
  @Input() title: string;
  globalFilter: TicketGlobalFilter = new TicketGlobalFilter();
  sub: Subscription = new Subscription();
  constructor(private ticketsStateService: TicketsStateService,) { }

  ngOnInit() {
    let onInitGlobalFilter = this.ticketsStateService.onInitGlobalFilter.subscribe((data: TicketGlobalFilter) => {
      this.globalFilter = data;
    });
    this.sub.add(onInitGlobalFilter);
    let getOnChangeTypeFilter = this.ticketsStateService.getOnChangeTypeFilter().subscribe(type => {
      this.globalFilter = new TicketGlobalFilter();
    })
    this.sub.add(getOnChangeTypeFilter);
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
