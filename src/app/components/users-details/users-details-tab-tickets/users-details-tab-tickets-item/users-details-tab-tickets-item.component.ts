import { Component, OnInit } from '@angular/core';
import { TicketsListService } from 'src/app/components/tickets/tickets/services/tickets-list.service';
import { UsersAsideDetailTicketsItemComponent } from 'src/app/components/users/users-aside-detail/users-aside-detail-tickets/users-aside-detail-tickets-item/users-aside-detail-tickets-item.component';

@Component({
  selector: 'app-users-details-tab-tickets-item',
  templateUrl: './users-details-tab-tickets-item.component.html',
  styleUrls: ['./users-details-tab-tickets-item.component.scss'],
  providers: [TicketsListService]
})
export class UsersDetailsTabTicketsItemComponent extends UsersAsideDetailTicketsItemComponent {


}
