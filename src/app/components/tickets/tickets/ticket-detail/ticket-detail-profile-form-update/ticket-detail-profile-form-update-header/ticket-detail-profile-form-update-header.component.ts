import { EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/components/users/class/user';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { CurrentUser } from 'src/class/current-user/current-user';
import { TicketProfile } from '../../../class/ticket-profile';
import { TicketsListService } from '../../../services/tickets-list.service';
import { AddAssignedUserComponent } from '../../../ticket-edit-aside/add-assigned-user/add-assigned-user.component';
import { TicketProfileFormUpdate } from '../../../ticket-edit-aside/class/ticket-profile-form-update';
import { TicketStateService } from '../../../ticket-edit-aside/services/ticket-state.service';
import { AddAssignedUserNoteComponent } from './add-assigned-user-note/add-assigned-user-note.component';

@Component({
  selector: 'ticket-detail-profile-form-update-header',
  templateUrl: './ticket-detail-profile-form-update-header.component.html',
  styleUrls: ['./ticket-detail-profile-form-update-header.component.scss'],
  providers: [TicketsListService]
})
export class TicketDetailProfileFormUpdateHeaderComponent implements OnInit {
  @Input() ticketProfile: TicketProfile = new TicketProfile();
  @ViewChild('addAssignedUser') addAssignedUser: AddAssignedUserNoteComponent;
  @Input() ticketProfileFormUpdate: TicketProfileFormUpdate = new TicketProfileFormUpdate();
  @Input() currentUser: CurrentUser;
  @Input() tab: string;
  @Output() onAddProduct = new EventEmitter();
  @Output() onAddService = new EventEmitter();
  usersForUpdate: Array<User> = [];
  selectedUsers: Array<CurrentUser> = [];
  listTechUsers: Array<User> = [];
  constructor(public ticketsListService: TicketsListService,
    public ticketStateService: TicketStateService,
    public usersStateService: UsersStateService,) { }


  ngOnInit() {
    this.setTab(this.tab);
    this.usersForUpdate = this.getUsersForUpdate(this.ticketProfileFormUpdate.noteType);
    this.usersForUpdate = this.getUsersForUpdate(this.ticketProfileFormUpdate.noteType);
    this.listTechUsers = this.getUsersForUpdate("PRIVATE");
    if (this.tab == "SERVICE" || this.tab == "PRODUCT") this.ticketProfileFormUpdate.setTechUser(this.currentUser);
  }
  public setTab(data) {
    this.tab = data;
    if (this.tab == "NOTE") {
      let users = this.usersStateService.getAllUsers().filter(user => user.customerCompaniesInfo.some(clientCompany => clientCompany.companyId === this.ticketProfile.company.id));
      this.selectedUsers = [this.ticketProfile.createdUser, ...users.filter(user => user.customerCompaniesInfo.find(clientCompany => clientCompany.companyId === this.ticketProfile.company.id).defaultSubscriptions.ticketManagerSubscription.enabled).map(item => new CurrentUser(item))]
      this.selectedUsers = this.selectedUsers.filter((item, pos) => this.selectedUsers.findIndex(accountItem => accountItem.id == item.id) == pos);
    } else {
      this.selectedUsers = [];
    }
  }
  isShowAssignedUser() {
    if (this.tab == "SERVICE") {
      return this.ticketStateService.isShowAddService();
    }
    return true;
  }
  isSelected(data) {
    return this.ticketProfileFormUpdate.getTechUser().id === data.id;
  }
  getUserName(user) {
    return `${user.firstName} ${user.lastName}`;
  }
  selectUser(user) {
    this.ticketProfileFormUpdate.setTechUser(user);
  }
  public trackByIndex(index, item) {
    return index;
  }
  public onChangeType(data) {
    this.ticketProfileFormUpdate.setNoteType(data);
    this.usersForUpdate = this.getUsersForUpdate(this.ticketProfileFormUpdate.noteType);
    this.addAssignedUser.resetList(this.usersForUpdate);
    this.selectedUsers = this.selectedUsers.filter(item => item.accountType !== "CLIENT");
  }
  getUsersForUpdate(type) {
    let userList = this.usersStateService.getAllUsers();
    let techusers = userList.filter((item) => item.accountType === "TECH" && !item.deletedAt);
    let clientUsers = userList.filter((item) => item.accountType === "CLIENT" && !item.deletedAt && item.customerCompaniesInfo.find(clientCompany => clientCompany.companyId === this.ticketProfile.company.id));
    if (type == "PUBLIC") return [...techusers, ...clientUsers].sort((a, b) => (`${a.firstName} ${a.lastName}`.toLowerCase() > `${b.firstName} ${b.lastName}`.toLowerCase()) ?
      1 : ((`${b.firstName} ${b.lastName}`.toLowerCase() > `${a.firstName} ${a.lastName}`.toLowerCase()) ? -1 : 0));
    if (type == "PRIVATE") return [...techusers].sort((a, b) => (`${a.firstName} ${a.lastName}`.toLowerCase() > `${b.firstName} ${b.lastName}`.toLowerCase()) ?
      1 : ((`${b.firstName} ${b.lastName}`.toLowerCase() > `${a.firstName} ${a.lastName}`.toLowerCase()) ? -1 : 0));
  }
  onSelectUpdateUser(data) {
    this.selectedUsers = data;
    this.ticketProfileFormUpdate.setShares(data);
  }
  addProduct() {
    this.onAddProduct.emit(null);
  }
  addService() {
    this.onAddService.emit(null);
  }
}
