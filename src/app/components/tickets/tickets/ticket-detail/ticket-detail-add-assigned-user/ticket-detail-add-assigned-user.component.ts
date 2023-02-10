import { Component, Input, OnInit } from '@angular/core';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { CurrentUser } from 'src/class/current-user/current-user';

@Component({
  selector: 'ticket-detail-add-assigned-user',
  templateUrl: './ticket-detail-add-assigned-user.component.html',
  styleUrls: ['./ticket-detail-add-assigned-user.component.scss']
})
export class TicketDetailAddAssignedUserComponent implements OnInit {
  @Input() listAssignedUser: Array<CurrentUser> = [];
  constructor(private usersStateService: UsersStateService,) { }

  ngOnInit() {
    console.log("getUsersForAssign", this.getUsersForAssign());
  }
  getUsersForAssign() {
    let userList = this.usersStateService.getAllUsers().sort((a, b) => (`${a.firstName} ${a.lastName}`.toLowerCase() > `${b.firstName} ${b.lastName}`.toLowerCase()) ?
      1 : ((`${b.firstName} ${b.lastName}`.toLowerCase() > `${a.firstName} ${a.lastName}`.toLowerCase()) ? -1 : 0));
    return userList.filter((item) => item.accountType === "TECH" && !item.deletedAt);

  }
}
