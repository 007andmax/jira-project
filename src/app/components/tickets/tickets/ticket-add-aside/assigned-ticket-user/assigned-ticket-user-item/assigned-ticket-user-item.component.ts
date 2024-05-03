import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from 'src/app/components/users/class/user';
import { TicketsListService } from '../../../services/tickets-list.service';

@Component({
  selector: 'app-assigned-ticket-user-item',
  templateUrl: './assigned-ticket-user-item.component.html',
  styleUrls: ['./assigned-ticket-user-item.component.scss'],
  providers: [TicketsListService],
})
export class AssignedTicketUserItemComponent implements OnInit {
  @Output() onSelect = new EventEmitter<any>();
  @Input() user: User;
  @Input() selectedUsers = [];
  listColorNoAvatar = [];
  constructor(public ticketsListService: TicketsListService,) { }

  ngOnInit() {
    this.listColorNoAvatar = this.ticketsListService.getListColorNoAvatar();
  }
  selected(user) {
    this.onSelect.emit(user);
  }
  public getUserName(user) {
    return (user) ? `${user.firstName} ${user.lastName}` : '';
  }
  isSelected(data) {
    return this.selectedUsers.find(item => item.id === data.id);
  }
}
