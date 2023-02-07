import { EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/components/users/class/user';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { CurrentUser } from 'src/class/current-user/current-user';
import { TicketProfile } from '../../../class/ticket-profile';
import { TicketsListService } from '../../../services/tickets-list.service';
import { AddAssignedUserComponent } from '../../../ticket-edit-aside/add-assigned-user/add-assigned-user.component';
import { TicketProfileFormUpdate } from '../../../ticket-edit-aside/class/ticket-profile-form-update';

@Component({
  selector: 'ticket-detail-profile-form-update-header',
  templateUrl: './ticket-detail-profile-form-update-header.component.html',
  styleUrls: ['./ticket-detail-profile-form-update-header.component.scss'],
  providers: [TicketsListService]
})
export class TicketDetailProfileFormUpdateHeaderComponent implements OnInit {
  @Input() ticketProfile: TicketProfile = new TicketProfile();
  @ViewChild('addAssignedUser') addAssignedUser: AddAssignedUserComponent;
  @Input() ticketProfileFormUpdate: TicketProfileFormUpdate = new TicketProfileFormUpdate();
  @Input() currentUser: CurrentUser;
  @Input() tab: string;
  @Output() onAddProduct = new EventEmitter();
  @Output() onAddService = new EventEmitter();
  usersForUpdate: Array<User> = [];
  selectedUsers: Array<CurrentUser> = [];
  listTechUsers: Array<User> = [];
  constructor(public ticketsListService: TicketsListService,
    public usersStateService: UsersStateService,) { }


  ngOnInit() {
    this.usersForUpdate = this.getUsersForUpdate(this.ticketProfileFormUpdate.noteType);
    this.usersForUpdate = this.getUsersForUpdate(this.ticketProfileFormUpdate.noteType);
    this.listTechUsers = this.getUsersForUpdate("PRIVATE");
    if (this.tab == "SERVICE" || this.tab == "PRODUCT") this.ticketProfileFormUpdate.setTechUser(this.currentUser);
  }
  getUserName(user) {
    return `${user.firstName} ${user.lastName}`;
  }
  selectUser(user) {
    this.ticketProfileFormUpdate.setTechUser(user);
  }
  public onChangeType(data) {
    this.ticketProfileFormUpdate.setNoteType(data);
    this.usersForUpdate = this.getUsersForUpdate(this.ticketProfileFormUpdate.noteType);
    console.log("this.usersForUpdate", this.usersForUpdate);
    this.addAssignedUser.resetList(this.usersForUpdate);
  }
  getUsersForUpdate(type) {
    let userList = this.usersStateService.getAllUsers().sort((a, b) => (`${a.firstName} ${a.lastName}`.toLowerCase() > `${b.firstName} ${b.lastName}`.toLowerCase()) ?
      1 : ((`${b.firstName} ${b.lastName}`.toLowerCase() > `${a.firstName} ${a.lastName}`.toLowerCase()) ? -1 : 0));
    let techusers = userList.filter((item) => item.accountType === "TECH" && !item.deletedAt);
    let clientUsers = userList.filter((item) => item.accountType === "CLIENT" && !item.deletedAt && item.company.id === this.ticketProfile.company.id);
    if (type == "PUBLIC") return [...techusers, ...clientUsers];
    if (type == "PRIVATE") return [...techusers];
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
