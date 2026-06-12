import { Component, OnInit, Input, OnDestroy, ChangeDetectorRef, Output, EventEmitter, ViewChild } from '@angular/core';
import { Ticket } from '../../../class/ticket';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { User } from 'src/app/components/users/class/user';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import * as moment from "moment";
import { TicketsListService } from '../../services/tickets-list.service';
import { TicketStatus } from 'src/app/components/setting/ticket-settings-page/tickets-status/class/ticket-status';
import { StatusColor } from '../../../class/status-color';
import { Subscription } from 'rxjs';
import { TicketsStateService } from 'src/app/states/tickets/tickets-state.service';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NgClass, NgStyle, NgIf, NgFor } from '@angular/common';
import { TicketsPermissionsService } from '../../ticket-edit-aside/services/tickets-permissions.service';
import { UsersTableCompanyByComponent } from 'src/app/components/users/users-table/users-table-company-by/users-table-company-by.component';
import { TicketsTableItemRequestedByComponent } from './tickets-table-item-requested-by/tickets-table-item-requested-by.component';

@Component({
  selector: 'app-tickets-table-item',
  templateUrl: './tickets-table-item.component.html',
  styleUrls: ['./tickets-table-item.component.scss'],
  providers: [TicketsListService, TicketsPermissionsService],
  standalone: true,
  imports: [NgClass, FormsModule, TicketsTableItemRequestedByComponent, NgStyle, NgIf, NgFor, NgbTooltipModule, UsersTableCompanyByComponent]
})
export class TicketsTableItemComponent implements OnInit, OnDestroy {
  ticket: Ticket;
  @Input() set setTicket(value) {
    this.ticket = value;
    this.assignedUser = this.usersStateService.getAllUsers().find(item => item.id === this.ticket.assignedUserId);
    this.requestedUser = this.usersStateService.getAllUsers().find(item => item.id === this.ticket.createdUserId);
  };
  @Input() listColors: Array<StatusColor> = [];
  @Input() selected: boolean = false;
  @Input() ticketsStatus: Array<TicketStatus> = [];
  @Output() onSelectTicket = new EventEmitter<any>();
  @Output() onSelectForDetail = new EventEmitter<any>();
  @ViewChild("assignedUserDp", { static: false }) assignedUserDp: AddAssignedUserComponent;
  assignedUser: User;
  requestedUser: User;
  indexNoAvatar: number = 0;
  listColorNoAvatar = [];
  users: Array<User> = [];
  userList: Array<User> = [];
  listAssignedUser: Array<CurrentUser> = [];
  sub: Subscription = new Subscription();
  constructor(public usersStateService: UsersStateService,
    public ticketsListService: TicketsListService,
    public companiesStateService: CompaniesStateService,
    public ticketsStateService: TicketsStateService,
    public customerPortalStateService: CustomerPortalStateService,
    public ticketsPermissionsService: TicketsPermissionsService,
    private appStateService: AppStateService,
    public cd: ChangeDetectorRef,) { }


  ngOnInit() {
    this.listColorNoAvatar = this.ticketsListService.getListColorNoAvatar();
    this.indexNoAvatar = this.ticketsListService.randomInteger(0, 6);
    let getOnUsers = this.usersStateService.getOnUsers().subscribe(data => {
      this.assignedUser = this.usersStateService.getAllUsers().find(item => item.id === this.ticket.assignedUserId);
      this.requestedUser = this.usersStateService.getAllUsers().find(item => item.id === this.ticket.createdUserId);
      this.userList = this.getUsersForAssign();
      this.users = JSON.parse(JSON.stringify(this.userList));
      if (this.assignedUserDp) this.assignedUserDp.resetList(this.userList);
      this.updateListAssignedUser();
    })
    this.sub.add(getOnUsers);
    let onChangeUsers = this.usersStateService.onChangeUsers.subscribe((data) => {
      this.assignedUser = this.usersStateService.getAllUsers().find(item => item.id === this.ticket.assignedUserId);
      this.requestedUser = this.usersStateService.getAllUsers().find(item => item.id === this.ticket.createdUserId);
      this.userList = this.getUsersForAssign();
      if (this.assignedUserDp) this.assignedUserDp.resetList(this.userList);
    })
    this.sub.add(onChangeUsers);
    let onSelectAll = this.ticketsStateService.onSelectAll.subscribe(data => {
      this.ticket.selected = data;
      this.cd.markForCheck();
    })
    this.sub.add(onSelectAll);
    if (this.usersStateService.getAllUsers().length > 0) {
      this.assignedUser = this.usersStateService.getAllUsers().find(item => item.id === this.ticket.assignedUserId);
      this.requestedUser = this.usersStateService.getAllUsers().find(item => item.id === this.ticket.createdUserId);
      this.userList = this.getUsersForAssign();
      this.users = JSON.parse(JSON.stringify(this.userList));
      if (this.assignedUserDp) this.assignedUserDp.resetList(this.userList);
      this.updateListAssignedUser();
    }
    let getOnUpdateTicket = this.ticketsStateService.getOnUpdateTicket().subscribe(data => {
      let ticket = new Ticket(data);
      if (data.assignedUser) ticket.setAssignedUserId(data.assignedUser.id);
      if (this.ticket.id == ticket.id) this.ticket = ticket;
      this.updateListAssignedUser();
      this.cd.detectChanges();
    })
    this.sub.add(getOnUpdateTicket);
  }

  shownPopover() {
    setTimeout(() => {
      this.appStateService.changeDetectorRef();
    }, 501);
  }


  onCloseDropDown(data, input) {
    input.value = "";
    //  this.users = JSON.parse(JSON.stringify(this.reqUsers));
  }

  private updateListAssignedUser() {
    this.listAssignedUser = [];
    if (this.ticket.assignedUserId) this.listAssignedUser.push(new CurrentUser(this.usersStateService.getAllUsers().find(item => item.id == this.ticket.assignedUserId)));
    if (this.ticket.multiAssignedUsers) this.listAssignedUser = [...this.listAssignedUser, ...this.usersStateService.getAllUsers().filter(item => this.ticket.multiAssignedUsers.some(user => user.id == item.id)).map(item => new CurrentUser(item))];
  }
  getUsersForAssign() {
    let userList = this.usersStateService.getAllUsers().sort((a, b) => (`${a.firstName} ${a.lastName}`.toLowerCase() > `${b.firstName} ${b.lastName}`.toLowerCase()) ?
      1 : ((`${b.firstName} ${b.lastName}`.toLowerCase() > `${a.firstName} ${a.lastName}`.toLowerCase()) ? -1 : 0));
    return userList.filter((item) => item.accountType === "TECH" && !item.deletedAt)
  }
  public getUserName(user) {
    return (user) ? `${user.firstName} ${user.lastName}` : '';
  }
  getCreateAt() {
    let date = new Date(this.ticket.createdAt);
    let currentDate = new Date();
    if (date.getFullYear() === currentDate.getFullYear() && date.getMonth() === currentDate.getMonth() && date.getDate() === currentDate.getDate()) {
      return moment(date).format('hh:mm A')
    }
    return moment(date).format('DD MMM')
  }
  selectTicket(event) {
    event.preventDefault();
    event.stopPropagation();
    if (event.target.checked) {
      this.ticketsStateService.addTicketForMerge(this.ticket);
    } else {
      let list = this.ticketsStateService.getTicketsForMerge();
      let index = list.findIndex(item => item.id === this.ticket.id);
      if (index > -1) this.ticketsStateService.removeSelectedTicketForMerge(index);
    }
    this.onSelectTicket.emit(this.ticket);
    this.cd.detectChanges();
  }
  selectForDetail() {
    this.onSelectForDetail.emit(null)
  }
  getAssignedUserNameForAvatar(user) {
    if (!user) return '';
    if (!user.avatar) return `${(user.firstName) ? user.firstName[0].toUpperCase() : ''}${(user.lastName) ? user.lastName[0].toUpperCase() : ''}`;
    return '';
  }
  checkLogo() {
    return (this.getCompanyById() && this.getCompanyById().logo && this.getCompanyById().logo.cropped && this.getCompanyById().logo.cropped.id || this.getCompanyById() && this.getCompanyById().logo && this.getCompanyById().logo.origin && this.getCompanyById().logo.origin.id)
  }
  parseLogo() {
    if (this.checkLogo()) {
      return `url(${this.companiesStateService.getCompanyLogoUrl(this.getCompanyById())}) center / cover no-repeat`;
    } else {
      return this.ticketsListService.getStyleAvatar(null, this.listColorNoAvatar[this.indexNoAvatar]);
    }
  }
  getCompanyById() {
    return this.companiesStateService.getCompanies().find(item => item.id === this.ticket.companyId);
  }
  getCompanyName() {
    let company = this.getCompanyById();
    return (company) ? company?.name : '';
  }
  getStyleStatus(name) {
    let find = this.ticketsStatus.find(item => item.name == name);
    return {
      'border-color': (this.listColors.length > 0) ? this.listColors[find.color].textColor : null,
      'background-color': (this.listColors.length > 0) ? this.listColors[find.color].borderColor : null, 'color': (this.listColors.length > 0) ? this.listColors[find.color].textColor : null
    }
  }
  getStyleNetAvatar(i) {
    return `${12 * i}px`;
  }
  getClassType() {
    return `priority-icon ${(this.ticket.priorityLevel && this.ticket.priorityLevel.name === "MEDIUM") ? '--' + this.ticket.priorityLevel.name.toLowerCase() : ''}`;
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
  public trackById(index, item) {
    return item.id;
  }
}
