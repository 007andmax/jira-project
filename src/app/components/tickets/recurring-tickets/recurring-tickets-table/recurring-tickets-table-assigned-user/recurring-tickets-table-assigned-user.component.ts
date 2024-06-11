import { Component, Input, OnInit } from '@angular/core';
import { TicketsListService } from '../../../tickets/services/tickets-list.service';

@Component({
  selector: 'app-recurring-tickets-table-assigned-user',
  templateUrl: './recurring-tickets-table-assigned-user.component.html',
  styleUrls: ['./recurring-tickets-table-assigned-user.component.scss'],
  providers: [TicketsListService]
})
export class RecurringTicketsTableAssignedUserComponent implements OnInit {
  @Input() user: any;
  indexNoAvatar: number = 0;
  listColorNoAvatar = [];

  constructor(public ticketsListService: TicketsListService,) { }

  ngOnInit() {
    this.listColorNoAvatar = this.ticketsListService.getListColorNoAvatar();
    this.indexNoAvatar = this.ticketsListService.randomInteger(0, 6);
  }
  getAssignedUserNameForAvatar(user) {
    if (!user) return '';
    if (!user.avatar) return `${(user.firstName) ? user.firstName[0].toUpperCase() : ''}${(user.lastName) ? user.lastName[0].toUpperCase() : ''}`;
    return '';
  }
  getStyleNetAvatar(i) {
    return `${12 * i}px`;
  }
}
