import { Component, OnInit } from '@angular/core';
import { User } from './class/user';
import { UsersStateService } from '../../states/users/users-state.service';
import { UserListService } from './services/user-list.service';
import { UserFilter } from './class/user-filter';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  providers: [UserListService]
})
export class UsersComponent implements OnInit {
users:Array<User> = [];
reqUsers:Array<User> = [];
showPreloader:boolean = true;
filter:UserFilter = new UserFilter();
public infiniteScrollDisabled = false;
  public page_number: number = 0;
  constructor(private usersStateService:UsersStateService, private userListService:UserListService) { }

  ngOnInit() {
    if (this.usersStateService.getAllUsers().length > 0)    this.getUsersList(this.usersStateService.getAllUsers());
    let getOnUsers =  this.usersStateService.getOnUsers().subscribe((data) => {
        this.getUsersList(data);
      })
      this.userListService.addSubscription(getOnUsers);
  }
  private getUsersList(data) {
    this.reqUsers = data.filter(item => !item.deletedAt);
     
   // this.onInirCalculate();
    this.reqUsers.sort((a, b) => ((a.firstName + a.lastName).toLowerCase() > (b.firstName + b.lastName).toLowerCase()) ?
      1 : (((b.firstName + b.lastName).toLowerCase() > (a.firstName + a.lastName).toLowerCase()) ? -1 : 0));
    this.onScroll();
    this.showPreloader = false;
  }
  public onScroll() {
    this.infiniteScrollDisabled = true;
    this.getCompanies();

  }
  private getCompanies() {
    if (this.userListService.getBlockList()) {
      this.infiniteScrollDisabled = false;
      return;
    }
    this.page_number += 1;
    let listFilter = this.reqUsers;//this.left_filter.getFilterList(this.reqUsers);
    let start = (this.page_number - 1) * 30;
    let end = ((this.page_number * 30) > listFilter.length) ? listFilter.length : this.page_number * 30;
    let usersList = [];
    for (let i = start; i < end; i++) {
      usersList.push(listFilter[i]);
    }
    this.users = [...this.users, ...usersList];
    this.infiniteScrollDisabled = false;
    if ((this.page_number * 30) > listFilter.length) this.userListService.setBlockList(true);
    

  }

  public trackById(index, item) {
    return item.id;
  }
  ngOnDestroy(): void {
    this.userListService.onUnsubscribe();
  }
}
