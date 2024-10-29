import { Component, OnInit } from '@angular/core';
import { UsersAsideDetailTicketsComponent } from '../../users/users-aside-detail/users-aside-detail-tickets/users-aside-detail-tickets.component';
import { TicketsListService } from '../../tickets/tickets/services/tickets-list.service';

@Component({
  selector: 'app-users-details-tab-tickets',
  templateUrl: './users-details-tab-tickets.component.html',
  styleUrls: ['./users-details-tab-tickets.component.scss'],
  providers: [TicketsListService]
})
export class UsersDetailsTabTicketsComponent extends UsersAsideDetailTicketsComponent {

}
