import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from 'src/app/components/users/class/user';
import { UserListService } from 'src/app/components/users/services/user-list.service';
import { MarketingEmailService } from 'src/app/services/marketing-email/marketing-email.service';
import { MarketingEmailStateService } from 'src/app/states/marketing-email/marketing-email-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { MarketingSubscriptionType } from '../../marketing-subscription-type/class/marketing-subscription-type';

@Component({
  selector: 'marketing-email-users-add',
  templateUrl: './marketing-email-users-add.component.html',
  styleUrls: ['./marketing-email-users-add.component.scss'],
  providers: [UserListService],


})
export class MarketingEmailUsersAddComponent implements OnInit {
  opened: boolean = false;
  users: Array<User> = [];
  reqUsers: Array<User> = [];
  search: string = "";
  @Output() onClose: EventEmitter<any> = new EventEmitter();
  @Input() marketingSubscription: MarketingSubscriptionType;
  public page_number: number = 0;
  public infiniteScrollDisabled = false;

  constructor(private marketingEmailStateService: MarketingEmailStateService,
    private userListService: UserListService,
    private marketingEmailService: MarketingEmailService,
    private cd: ChangeDetectorRef,
    private usersStateService: UsersStateService,) { }

  ngOnInit() {

    if (this.usersStateService.getAllUsers().length > 0) this.getUsersList(this.usersStateService.getAllUsers());
    let getOnUsers = this.usersStateService.getOnUsers().subscribe((data) => {
      this.getUsersList(data);
    })

  }
  onSearch() {
    this.userListService.setBlockList(false);
    this.page_number = 0;
    this.users = [];
    this.onScroll();
  }
  private getUsersList(data) {
    this.reqUsers = JSON.parse(JSON.stringify(data)).filter(item => !item.deletedAt && item.accountType !== "TECH");
    this.reqUsers.sort((a, b) => ((a.firstName + a.lastName).toLowerCase() > (b.firstName + b.lastName).toLowerCase()) ?
      1 : (((b.firstName + b.lastName).toLowerCase() > (a.firstName + a.lastName).toLowerCase()) ? -1 : 0));
    this.onScroll();

    this.cd.markForCheck();
  }
  public onScroll() {
    this.infiniteScrollDisabled = true;
    this.getUsers();

  }
  public checkClearSelectedUsers(data) {

    if (data) {
      if (this.usersStateService.getAllUsers().length > 0) this.getUsersList(this.usersStateService.getAllUsers());
      this.onSearch();
    } else {
      this.userListService.setBlockList(true);
    }
  }
  onAdd() {
    if (this.reqUsers.filter(item => item.selected).length > 0) {
      this.marketingEmailService.addUsers(this.marketingSubscription.id, this.reqUsers.filter(item => item.selected).map(item => item.id)).subscribe(data => {
        this.close();
      })
    }
  }
  onSelect(user) {

    this.reqUsers.find(item => item.id === user.id).selected = user.selected;
    this.cd.markForCheck();
  }
  close() {
    this.onClose.emit(null);
  }
  private getUsers() {
    console.log("getUsers");
    if (this.userListService.getBlockList()) {
      this.infiniteScrollDisabled = false;
      return;
    }
    this.page_number += 1;

    let listFilter = this.reqUsers.filter(item => `${item.firstName} ${item.lastName}`.toLowerCase().includes(this.search));


    let start = (this.page_number - 1) * 30;
    let end = ((this.page_number * 30) > listFilter.length) ? listFilter.length : this.page_number * 30;
    let usersList = [];
    for (let i = start; i < end; i++) {
      usersList.push(listFilter[i]);
    }
    this.users = [...this.users, ...usersList.map(item => new User(JSON.parse(JSON.stringify(item))))];
    console.log("this.users", this.users);
    console.log("listFilter", listFilter.length);
    this.infiniteScrollDisabled = false;
    if ((this.page_number * 30) > listFilter.length) this.userListService.setBlockList(true);


  }
  public trackById(index, item) {
    return item.id;
  }
}
