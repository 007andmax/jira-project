import { Component, OnInit } from '@angular/core';
import { TicketGlobalFilter } from 'src/app/components/tickets/tickets/class/ticket-global-filter';
import { TicketsStateService } from 'src/app/states/tickets/tickets-state.service';
import { UserGlobalFilter } from '../../class/user-global-filters';
import { UsersStateService } from 'src/app/states/users/users-state.service';

@Component({
  selector: 'app-users-filter-info',
  templateUrl: './users-filter-info.component.html',
  styleUrls: ['./users-filter-info.component.scss']
})
export class UsersFilterInfoComponent implements OnInit {
  globalFilter: UserGlobalFilter = new UserGlobalFilter();
  constructor(public usersStateService: UsersStateService,) { }

  ngOnInit() {
    let onInitGlobalFilter = this.usersStateService.onInitGlobalFilter.subscribe((data: UserGlobalFilter) => {
      this.globalFilter = data;
    });
    let getOnChangeTypeFilter = this.usersStateService.onClearGlobalFilter.subscribe(type => {
      this.globalFilter = new UserGlobalFilter();
    })
  }
}
