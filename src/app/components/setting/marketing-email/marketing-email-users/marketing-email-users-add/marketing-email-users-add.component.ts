import { PreloaderTicketComponent } from './';
import { MarketingEmailUsersAddItemComponent } from './';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { User } from 'src/app/components/users/class/user';
import { UserListService } from 'src/app/components/users/services/user-list.service';
import { DisabledBtnDirective } from 'src/app/directives/disabled-btn/disabled-btn.directive';
import { MarketingEmailService } from 'src/app/services/marketing-email/marketing-email.service';
import { MarketingEmailStateService } from 'src/app/states/marketing-email/marketing-email-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { MarketingSubscriptionType } from '../../marketing-subscription-type/class/marketing-subscription-type';
import { ToastrService } from 'ngx-toastr';
import { AppStateService } from 'src/app/states/app/app-state.service';
import { Subscription } from 'rxjs';

@Component({
  standalone: true,
  imports: [PreloaderTicketComponent, MarketingEmailUsersAddItemComponent, FormsModule, CommonModule],
    selector: 'marketing-email-users-add',
    templateUrl: './marketing-email-users-add.component.html',
    styleUrls: ['./marketing-email-users-add.component.scss'],
    providers: [UserListService],
    standalone: true,
})
export class MarketingEmailUsersAddComponent implements OnInit, OnDestroy {
  opened: boolean = false;
  users: Array<User> = [];
  reqUsers: Array<User> = [];
  search: string = "";
  @Output() onClose: EventEmitter<any> = new EventEmitter();
  @Input() marketingSubscription: MarketingSubscriptionType;
  @ViewChild('addBtn', { static: true }) addBtn: DisabledBtnDirective;
  public page_number: number = 0;
  public infiniteScrollDisabled = false;
  sub: Subscription = new Subscription();
  constructor(private userListService: UserListService,
    private marketingEmailService: MarketingEmailService,
    private cd: ChangeDetectorRef,
    private toastrService: ToastrService,
    private appStateService: AppStateService,
    private usersStateService: UsersStateService,) { }

  ngOnInit() {

    if (this.usersStateService.getAllUsers().length > 0) this.getUsersList(this.usersStateService.getAllUsers());
    let getOnUsers = this.usersStateService.getOnUsers().subscribe((data) => {
      this.getUsersList(data);
    })
    this.sub.add(getOnUsers);
    let onChangeUsers = this.usersStateService.onChangeUsers.subscribe((data) => {
      this.getUsersList(this.usersStateService.getAllUsers());
    })
    this.sub.add(onChangeUsers);
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
      this.addBtn.setDisabled(true);
      this.marketingEmailService.addUsers(this.marketingSubscription.id, this.reqUsers.filter(item => item.selected).map(item => item.id)).subscribe(data => {
        this.toastrService.success("The subscription has been successfully added");
        this.appStateService.changeDetectorRef();
        this.addBtn.setDisabled(false);
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
    this.infiniteScrollDisabled = false;
    if ((this.page_number * 30) > listFilter.length) this.userListService.setBlockList(true);
  }
  public trackById(index, item) {
    return item.id;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
