import { ChangeDetectorRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/components/users/class/user';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { CurrentUser } from 'src/class/current-user/current-user';
import { TicketProfile } from '../../../class/ticket-profile';
import { TicketsListService } from '../../../services/tickets-list.service';
import { TicketProfileFormUpdate } from '../../../ticket-edit-aside/class/ticket-profile-form-update';
import { TicketStateService } from '../../../ticket-edit-aside/services/ticket-state.service';
import { AddAssignedUserNoteComponent } from './add-assigned-user-note/add-assigned-user-note.component';
import { AddAssignedUserComponent } from '../../../ticket-edit-aside/add-assigned-user/add-assigned-user.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TicketDetailProfileFormUpdateComponent } from '../ticket-detail-profile-form-update.component';

@Component({
  selector: 'ticket-detail-profile-form-update-header',
  templateUrl: './ticket-detail-profile-form-update-header.component.html',
  styleUrls: ['./ticket-detail-profile-form-update-header.component.scss'],
  providers: [TicketsListService]
})
export class TicketDetailProfileFormUpdateHeaderComponent implements OnInit {
  @Input() ticketProfile: TicketProfile = new TicketProfile();
  @ViewChild('addAssignedUser', { static: true }) addAssignedUser: AddAssignedUserNoteComponent;
  @Input() ticketProfileFormUpdate: TicketProfileFormUpdate = new TicketProfileFormUpdate();
  @Input() currentUser: CurrentUser;
  @Input() tab: string;
  @Output() onAddProduct = new EventEmitter();
  @Output() onAddService = new EventEmitter();
  @Input() toggleModal: boolean = false;
  usersForUpdate: Array<User> = [];
  selectedUsers: Array<CurrentUser> = [];
  listTechUsers: Array<User> = [];
  constructor(public ticketsListService: TicketsListService,
    public ticketStateService: TicketStateService,
    private modalService: NgbModal,
    public usersStateService: UsersStateService,
    public cd: ChangeDetectorRef,) { }


  ngOnInit() {
    if (this.ticketProfileFormUpdate.shares.length > 0) {
      this.ticketProfileFormUpdate.shares.forEach(element => {
        let user = this.usersStateService.getAllUsers().find(item => item.id == element.user.id);
        if (user) this.selectedUsers.push(new CurrentUser(user));
      });
    } else {
      this.setTab(this.tab);
    }
    this.usersForUpdate = this.getUsersForUpdate(this.ticketProfileFormUpdate.noteType);
    this.usersForUpdate = this.getUsersForUpdate(this.ticketProfileFormUpdate.noteType);
    this.listTechUsers = this.getUsersForUpdate("PRIVATE");
    if (this.tab == "SERVICE" || this.tab == "PRODUCT") this.ticketProfileFormUpdate.setTechUser(this.currentUser);
  }
  public setTab(data) {
    this.tab = data;
    if (this.tab == "NOTE") {
      if (this.ticketProfileFormUpdate.noteType == "PUBLIC") {
        let users = this.usersStateService.getAllUsers().filter(user => user.customerCompaniesInfo.some(clientCompany => clientCompany.companyId === this.ticketProfile.company.id));
        this.selectedUsers = [...users.filter(user => user.customerCompaniesInfo.find(clientCompany => clientCompany.companyId === this.ticketProfile.company.id).defaultSubscriptions.ticketManagerSubscription.enabled).map(item => new CurrentUser(item))]
        if (this.ticketProfile.createdUser) this.selectedUsers.push(this.ticketProfile.createdUser);
        this.selectedUsers = this.selectedUsers.filter((item, pos) => this.selectedUsers.findIndex(accountItem => accountItem.id == item.id) == pos);
      } else {
        this.selectedUsers = [];
      }
    } else {
      this.selectedUsers = [];
    }
    this.ticketProfileFormUpdate.setShares(this.selectedUsers);
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
  onCloseModal() {
    this.ticketStateService.closeModalNote(this.ticketProfileFormUpdate);
  }

  public onChangeType(data) {
    this.ticketProfileFormUpdate.setNoteType(data);
    this.usersForUpdate = this.getUsersForUpdate(this.ticketProfileFormUpdate.noteType);
    if (this.addAssignedUser) this.addAssignedUser.resetList(this.usersForUpdate);
    if (data == "PUBLIC") {
      let users = this.usersStateService.getAllUsers().filter(user => user.customerCompaniesInfo.some(clientCompany => clientCompany.companyId === this.ticketProfile.company.id));
      this.selectedUsers = [...users.filter(user => user.customerCompaniesInfo.find(clientCompany => clientCompany.companyId === this.ticketProfile.company.id).defaultSubscriptions.ticketManagerSubscription.enabled).map(item => new CurrentUser(item))]
      if (this.ticketProfile.createdUser) this.selectedUsers.push(this.ticketProfile.createdUser);
      this.selectedUsers = this.selectedUsers.filter((item, pos) => this.selectedUsers.findIndex(accountItem => accountItem.id == item.id) == pos);
    } else {
      this.selectedUsers = [];
    }
    this.ticketProfileFormUpdate.setShares(this.selectedUsers);

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
