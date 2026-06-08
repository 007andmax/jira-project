import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { User } from 'src/app/components/users/class/user';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { CurrentUser } from 'src/class/current-user/current-user';
import { AddAssignedUserComponent } from '../../ticket-edit-aside/add-assigned-user/add-assigned-user.component';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';
import { TicketProfile } from '../../class/ticket-profile';
import { TicketsPermissionsService } from '../../ticket-edit-aside/services/tickets-permissions.service';
import { Subscription } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule, AddAssignedUserComponent],
  selector: 'ticket-detail-add-assigned-user',
  templateUrl: './ticket-detail-add-assigned-user.component.html',
  styleUrls: ['./ticket-detail-add-assigned-user.component.scss']
})
export class TicketDetailAddAssignedUserComponent implements OnInit, OnDestroy {
  @Input() listAssignedUser: Array<CurrentUser> = [];
  @ViewChild("assignedUser", { static: true }) assignedUser: AddAssignedUserComponent;
  @Output() onSelectAssignedUser = new EventEmitter<any>();
  userList: Array<User> = [];
  @Input() ticketProfile: TicketProfile = new TicketProfile();
  sub: Subscription = new Subscription();
  constructor(private usersStateService: UsersStateService,
    public customerPortalStateService: CustomerPortalStateService,
    public ticketsPermissionsService: TicketsPermissionsService,) { }

  ngOnInit() {
    if (this.usersStateService.getAllUsers().length > 0) {
      this.userList = this.getUsersForAssign();
      this.assignedUser.resetList(this.userList);
    }
    let getOnUsers = this.usersStateService.getOnUsers().subscribe((data) => {
      this.userList = this.getUsersForAssign();
      this.assignedUser.resetList(this.userList);
    })
    this.sub.add(getOnUsers);
    let onChangeUsers = this.usersStateService.onChangeUsers.subscribe((data) => {
      this.userList = this.getUsersForAssign();
      this.assignedUser.resetList(this.userList);
    })
    this.sub.add(onChangeUsers);
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
