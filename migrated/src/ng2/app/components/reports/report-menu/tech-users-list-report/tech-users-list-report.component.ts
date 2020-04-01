import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { TehUsersService } from 'src/ng2/app/services/teh-users/teh-users.service';
import { UsersStateService } from 'src/ng2/app/states/users/users-state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tech-users-list-report',
  templateUrl: './tech-users-list-report.component.html',
  styleUrls: ['./tech-users-list-report.component.scss']
})
export class TechUsersListReportComponent implements OnInit, OnDestroy {
  public usersList: any = [];
  public selectedUser = null;
  resUserList = [];
  sub: Subscription = new Subscription();
  @Output() onChange = new EventEmitter<any>();

  constructor(private tehService: TehUsersService,
    private usersStateService: UsersStateService) { }

  ngOnInit() {

    if (this.usersStateService.getAllUsers().length > 0) {
      this.setUsers(this.usersStateService.getAllUsers());
    }
    let getOnUsers = this.usersStateService.getOnUsers().subscribe((data) => {
      this.setUsers(data);
    })
    this.sub.add(getOnUsers);
  }
  setUsers(data) {
    this.resUserList = data.filter(item => {
      if (item.accountType === 'TECH' && !item.deletedAt) {
        item.selected = false;
        return item;
      }
    });
    this.usersList = JSON.parse(JSON.stringify(this.resUserList));
  }
  getSelectedUser() {
    return (this.selectedUser) ? `${this.selectedUser.firstName} ${this.selectedUser.lastName}` : '';
  }
  onSelect(data) {
    this.selectedUser = data;

    this.onChange.emit(data);
  }
  clearClient() {

    this.selectedUser = null;
    this.onChange.emit(null);
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  public trackByIndex(index, item) {
    return index;
  }
}
