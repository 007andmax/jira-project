import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs-compat/Subscription';
import { User } from 'src/app/components/users/class/user';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { CurrentUser } from 'src/class/current-user/current-user';
import { AddAssignedUserComponent } from '../../ticket-edit-aside/add-assigned-user/add-assigned-user.component';

@Component({
  selector: 'ticket-detail-add-assigned-user',
  templateUrl: './ticket-detail-add-assigned-user.component.html',
  styleUrls: ['./ticket-detail-add-assigned-user.component.scss']
})
export class TicketDetailAddAssignedUserComponent implements OnInit, OnDestroy {
  @Input() listAssignedUser: Array<CurrentUser> = [];
  @ViewChild("assignedUser") assignedUser: AddAssignedUserComponent;
  @Output() onSelectAssignedUser = new EventEmitter<any>();
  userList: Array<User> = [];
  sub: Subscription = new Subscription();
  constructor(private usersStateService: UsersStateService,) { }

  ngOnInit() {
    console.log("getUsersForAssign", this.getUsersForAssign());
    if (this.usersStateService.getAllUsers().length > 0) {
      this.userList = this.getUsersForAssign();
      this.assignedUser.resetList(this.userList);
    }
    let getOnUsers = this.usersStateService.getOnUsers().subscribe((data) => {
      this.userList = this.getUsersForAssign();
      this.assignedUser.resetList(this.userList);
    })
    this.sub.add(getOnUsers);
  }
  openAssignedUser() {
    this.assignedUser.assignedUserDp.open();
  }
  getUsersForAssign() {
    let userList = this.usersStateService.getAllUsers().sort((a, b) => (`${a.firstName} ${a.lastName}`.toLowerCase() > `${b.firstName} ${b.lastName}`.toLowerCase()) ?
      1 : ((`${b.firstName} ${b.lastName}`.toLowerCase() > `${a.firstName} ${a.lastName}`.toLowerCase()) ? -1 : 0));
    return userList.filter((item) => item.accountType === "TECH" && !item.deletedAt)
  }
  selectAssignedUser(data) {
    this.onSelectAssignedUser.emit(data);
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
