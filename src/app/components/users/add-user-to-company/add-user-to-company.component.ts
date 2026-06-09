
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { User } from '../class/user';
import { UserFilter } from '../class/user-filter';
import { UserListService } from '../services/user-list.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { Company } from 'src/app/interfaces/company/company';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { UsersService } from 'src/app/services/users/users.service';
import { Subscription } from 'rxjs';
import { DisabledBtnDirective } from 'src/app/directives/disabled-btn/disabled-btn.directive';
import { PreloaderTicketComponent } from '../../shared/preloader-ticket/preloader-ticket.component';
import { AddUserToCompanyItemComponent } from './add-user-to-company-item/add-user-to-company-item.component';
import { AddUserToCompanySelectedItemComponent } from './add-user-to-company-selected-item/add-user-to-company-selected-item.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@Component({
  standalone: true,
  imports: [AddUserToCompanyItemComponent, DisabledBtnDirective, InfiniteScrollModule, AddUserToCompanySelectedItemComponent, PreloaderTicketComponent, FormsModule, CommonModule],
  selector: 'app-add-user-to-company',
  templateUrl: './add-user-to-company.component.html',
  styleUrls: ['./add-user-to-company.component.scss'],
  providers: [UserListService, NgbModalConfig, NgbModal],

})
export class AddUserToCompanyComponent implements OnInit, OnDestroy {
  @Input() company: Company;
  @ViewChild('addBtn', { static: true }) addBtn: DisabledBtnDirective;
  container = document.body.querySelector(".user-company-content");
  public infiniteScrollDisabled = false;
  public page_number: number = 0;
  companies: Array<Company> = [];
  users: Array<User> = [];
  reqUsers: Array<User> = [];
  filter: UserFilter = new UserFilter();
  searchText: string = "";
  sub: Subscription = new Subscription();
  constructor(private userListService: UserListService,
    public cd: ChangeDetectorRef,
    private usersStateService: UsersStateService,
    public activeModal: NgbActiveModal,
    private usersService: UsersService,
    private companiesStateService: CompaniesStateService,) { }


  ngOnInit() {
    this.container = document.body.querySelector(".user-company-content");
    document.body.querySelector(".user-company-list").scrollTo(0, 0);
    if (this.companiesStateService.getCompanies().length > 0) this.companies = this.companiesStateService.getCompanies();
    let getOnCompanies = this.companiesStateService.getOnCompanies().subscribe((data) => {
      this.companies = data;
    })
    this.sub.add(getOnCompanies);
    if (this.usersStateService.getAllUsers().length > 0) this.getUsersList(JSON.parse(JSON.stringify(this.usersStateService.getAllUsers())).map(item => new User(item)));
    let getOnUsers = this.usersStateService.getOnUsers().subscribe((data) => {
      this.getUsersList(JSON.parse(JSON.stringify(data)).map(item => new User(item)));
    })
    this.sub.add(getOnUsers);
    let onChangeUsers = this.usersStateService.onChangeUsers.subscribe((data) => {
      this.getUsersList(JSON.parse(JSON.stringify(this.usersStateService.getAllUsers())).map(item => new User(item)));
    })
    this.sub.add(onChangeUsers);
  }
  clearSearch() {
    this.searchText = "";
    this.onSearch("");
  }
  private getUsersList(data) {
    this.reqUsers = data.filter(item => !item.deletedAt && item.accountType !== "TECH" && !item.customerCompaniesInfo.some(compnay => compnay.companyId == this.company.id));
    this.reqUsers.sort((a, b) => ((a.firstName + a.lastName).toLowerCase() > (b.firstName + b.lastName).toLowerCase()) ?
      1 : (((b.firstName + b.lastName).toLowerCase() > (a.firstName + a.lastName).toLowerCase()) ? -1 : 0));
    this.onScroll();
    this.cd.detectChanges();
  }
  onSearch(value) {
    document.body.querySelector(".user-company-list").scrollTo(0, 0);
    // this.reqUsers.forEach(item => item.selected = false);
    this.filter.setSearch((value !== "") ? value : null);
    this.setDefaultScoll();
    this.onScroll();
  }
  addUser() {
    this.cancelConfirm();
    this.usersStateService.onOpenAsige();
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
  approveConfirm() {
    let usersId = this.getSelectedUsers().map(item => item.id);
    if (usersId.length > 0) {
      this.addBtn.setDisabled(true);
      this.usersService.addUserToCompany(this.company.id, usersId).subscribe(data => {
        this.addBtn.setDisabled(false);
        this.cancelConfirm();
      }, err => {
        this.addBtn.setDisabled(false);
      })
    }
  }
  getSelectedUsers() {
    return this.reqUsers.filter(item => item.selected);
  }
  onSelectUser(user) {
    this.reqUsers.find(item => item.id === user.id).selected = user.selected;
    this.clearSearch();
    this.cd.detectChanges();
  }
  cancelConfirm() {
    this.reqUsers.forEach(item => item.selected = false);
    this.users.forEach(item => item.selected = false);
    this.activeModal.close();
  };
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
  public trackByIndex(index, item) {
    return index;
  }
}
