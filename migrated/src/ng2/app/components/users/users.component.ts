import { Component, OnInit } from '@angular/core';
import { User } from './class/user';
import { UsersStateService } from '../../states/users/users-state.service';
import { UserListService } from './services/user-list.service';
import { UserFilter } from './class/user-filter';
import { CompaniesStateService } from '../../states/company/companies-state.service';
import { Company } from '../../interfaces/company/company';
import { ConfirmStateService } from '../shared/confirm/services/confirm-state.service';
import { ARCHIVE_USER } from '../../const/confirm';
import { UsersService } from '../../services/users/users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  providers: [UserListService]
})
export class UsersComponent implements OnInit {
users:Array<User> = [];
companies:Array<Company> = [];
reqUsers:Array<User> = [];
showPreloader:boolean = true;
filter:UserFilter = new UserFilter();
showArchivedUsers:boolean = false;
public infiniteScrollDisabled = false;
  public page_number: number = 0;
  constructor(private usersStateService:UsersStateService, private userListService:UserListService, 
    private companiesStateService:CompaniesStateService,
    private confirmStateService:ConfirmStateService,
    private usersService:UsersService) { }

  ngOnInit() {
    let getOnShowArchived = this.usersStateService.getOnShowArchived().subscribe(data => {
      this.showArchivedUsers = data;
     
      this.filter.setClientType(null);
      this.filter.clearFilter();
      this.setDefaultScoll();
      this.getUsersList(this.usersStateService.getAllUsers());
    })
    this.userListService.addSubscription(getOnShowArchived);

    let geLefttFilter = this.usersStateService.getOnFilter().subscribe((data) => {
      this.filter.setLeftFilters(data.clientType,data.company,data.clientIndustry,data.title);
      this.setDefaultScoll();
      this.onScroll();
   //   this.onInirCalculate();

    })
    this.userListService.addSubscription(geLefttFilter);

    if (this.companiesStateService.getCompanies().length > 0)  this.companies = this.companiesStateService.getCompanies();
    let getOnCompanies =  this.companiesStateService.getOnCompanies().subscribe((data) => {

        this.companies = data;
      })
      this.userListService.addSubscription(getOnCompanies);
    if (this.usersStateService.getAllUsers().length > 0)    this.getUsersList(this.usersStateService.getAllUsers());
    let getOnUsers =  this.usersStateService.getOnUsers().subscribe((data) => {
        this.getUsersList(data);
      })
      this.userListService.addSubscription(getOnUsers);

      let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
        if (data) {
          if (this.confirmStateService.getConfirmAction() === ARCHIVE_USER) {
            this.onArchiveUser(this.usersStateService.getUserForArchive().id);
          }
        
        }
      })
      this.userListService.addSubscription(getConfirm);
  }
  private onArchiveUser (id) {
    let ids = [];
    ids.push(id);
    let archiveCompany =  this.usersService.onArchiveUsers(ids).subscribe(data => {
      
      let index = this.users.findIndex(item => item.id === id);
      if (index > -1) this.users.splice(index, 1);
    })
    this.userListService.addSubscription(archiveCompany);
  }
  private getUsersList(data) {
    this.reqUsers = data.filter(item => ((!this.showArchivedUsers) ? !item.deletedAt : item.deletedAt));
     
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
  public onFilter (field) {
this.filter.onFilter(field, this.reqUsers,this.companies)
    this.page_number = 0;
    this.userListService.setBlockList(false);
    this.users = [];
    this.onScroll();
  }
  private getCompanies() {
    if (this.userListService.getBlockList()) {
      this.infiniteScrollDisabled = false;
      return;
    }
    this.page_number += 1;
    let listFilter = this.filter.getFilterList(this.reqUsers,this.companies);
    this.usersStateService.setCount(listFilter.length);
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
  public setDefaultScoll() {
    this.page_number = 0;
    this.userListService.setBlockList(false);
    this.users = [];
  }
  public trackById(index, item) {
    return item.id;
  }
  ngOnDestroy(): void {
    this.userListService.onUnsubscribe();
  }
}
