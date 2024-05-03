import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/components/users/class/user';
import { TicketsListService } from '../../../services/tickets-list.service';

@Component({
  selector: 'app-assigned-ticket-user-selected-item',
  templateUrl: './assigned-ticket-user-selected-item.component.html',
  styleUrls: ['./assigned-ticket-user-selected-item.component.scss'],
  providers: [TicketsListService],
})
export class AssignedTicketUserSelectedItemComponent implements OnInit {
  @Input() user: User;
  listColorNoAvatar = [];
  constructor(public ticketsListService: TicketsListService,) { }

  ngOnInit() {
    this.listColorNoAvatar = this.ticketsListService.getListColorNoAvatar();
  }

}
