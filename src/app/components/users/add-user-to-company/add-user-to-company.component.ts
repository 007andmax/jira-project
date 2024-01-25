import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { User } from '../class/user';
import { UserFilter } from '../class/user-filter';
import { UserListService } from '../services/user-list.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { Company } from 'src/app/interfaces/company/company';
import { UsersStateService } from 'src/app/states/users/users-state.service';

@Component({
  selector: 'app-add-user-to-company',
  templateUrl: './add-user-to-company.component.html',
  styleUrls: ['./add-user-to-company.component.scss'],
  providers: [UserListService],
})
export class AddUserToCompanyComponent implements OnInit {
  container = document.body.querySelector(".users-list");
  public infiniteScrollDisabled = false;
  public page_number: number = 0;
  companies: Array<Company> = [];
  users: Array<User> = [];
  reqUsers: Array<User> = [];
  filter: UserFilter = new UserFilter();
  constructor(private userListService: UserListService,
    public cd: ChangeDetectorRef,
    private usersStateService: UsersStateService,
    private companiesStateService: CompaniesStateService,) { }

  ngOnInit() {
    if (this.companiesStateService.getCompanies().length > 0) this.companies = this.companiesStateService.getCompanies();
    let getOnCompanies = this.companiesStateService.getOnCompanies().subscribe((data) => {
      this.companies = data;
    })
    if (this.usersStateService.getAllUsers().length > 0) this.getUsersList(this.usersStateService.getAllUsers());
    let getOnUsers = this.usersStateService.getOnUsers().subscribe((data) => {
      this.getUsersList(data);
    })
  }
  private getUsersList(data) {
    this.reqUsers = data.filter(item => !item.deletedAt && item.accountType !== "TECH");
    this.reqUsers.sort((a, b) => ((a.firstName + a.lastName).toLowerCase() > (b.firstName + b.lastName).toLowerCase()) ?
      1 : (((b.firstName + b.lastName).toLowerCase() > (a.firstName + a.lastName).toLowerCase()) ? -1 : 0));
    this.onScroll();
    //this.showPreloader = false;
    //this.header.setReqUsers(this.reqUsers);
    this.cd.detectChanges();
  }
  onSearch(value) {
    document.body.querySelector(".main-container").scrollTo(0, 0);
    this.filter.setSearch((value !== "") ? value : null);
    this.setDefaultScoll();
    this.onScroll();
  }
  public setDefaultScoll() {
    this.page_number = 0;
    this.userListService.setBlockList(false);
    this.users = [];
    this.cd.detectChanges();
  }
  public onScroll() {
    this.infiniteScrollDisabled = true;
    this.getUsers();
  }
  private getUsers() {
    if (this.userListService.getBlockList()) {
      this.infiniteScrollDisabled = false;
      this.cd.detectChanges();
      return;
    }
    this.page_number += 1;
    let listFilter = this.filter.getFilterList(this.reqUsers, this.companies);
    let start = (this.page_number - 1) * 30;
    let end = ((this.page_number * 30) > listFilter.length) ? listFilter.length : this.page_number * 30;
    let usersList = [];
    for (let i = start; i < end; i++) {
      usersList.push(listFilter[i]);
    }
    this.users = [...this.users, ...usersList.map(item => new User(JSON.parse(JSON.stringify(item))))];
    this.infiniteScrollDisabled = false;
    if ((this.page_number * 30) > listFilter.length) this.userListService.setBlockList(true);
    this.cd.detectChanges();
  }
  public trackById(index, item) {
    return item.id;
  }
}
