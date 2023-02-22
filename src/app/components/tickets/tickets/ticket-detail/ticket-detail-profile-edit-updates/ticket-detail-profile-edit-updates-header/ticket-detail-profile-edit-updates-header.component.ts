import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from 'src/app/components/users/class/user';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { TicketProfileUpdate } from '../../../class/ticket-profile-update';
import { TicketsListService } from '../../../services/tickets-list.service';

@Component({
  selector: 'ticket-detail-profile-edit-updates-header',
  templateUrl: './ticket-detail-profile-edit-updates-header.component.html',
  styleUrls: ['./ticket-detail-profile-edit-updates-header.component.scss'],
  providers: [TicketsListService]
})
export class TicketDetailProfileEditUpdatesHeaderComponent implements OnInit {
  @Input() update: TicketProfileUpdate;
  @Output() onSelectUser = new EventEmitter();
  listTechUsers: Array<User> = [];
  constructor(public usersStateService: UsersStateService,
    public ticketsListService: TicketsListService,) { }

  ngOnInit() {
    this.listTechUsers = this.getUsersForUpdate();
    console.log(this.update);
  }
  getUsersForUpdate() {
    let userList = this.usersStateService.getAllUsers().sort((a, b) => (`${a.firstName} ${a.lastName}`.toLowerCase() > `${b.firstName} ${b.lastName}`.toLowerCase()) ?
      1 : ((`${b.firstName} ${b.lastName}`.toLowerCase() > `${a.firstName} ${a.lastName}`.toLowerCase()) ? -1 : 0));
    return userList.filter((item) => item.accountType === "TECH" && !item.deletedAt);
  }
  selectUser(user) {
    this.onSelectUser.emit(user);
    this.update.setUserUpdate(user);
  }
  getUserName(user) {
    return `${user.firstName} ${user.lastName}`;
  }
}
