import { Component, OnInit, Input, OnDestroy, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
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

@Component({
  selector: 'app-tickets-table-item',
  templateUrl: './tickets-table-item.component.html',
  styleUrls: ['./tickets-table-item.component.scss'],
  providers: [TicketsListService]
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
  assignedUser: User;
  requestedUser: User;
  indexNoAvatar: number = 0;
  listColorNoAvatar = [];
  sub: Subscription = new Subscription();
  constructor(public usersStateService: UsersStateService,
    public ticketsListService: TicketsListService,
    public companiesStateService: CompaniesStateService,
    public ticketsStateService: TicketsStateService,
    public cd: ChangeDetectorRef,) { }


  ngOnInit() {
    this.listColorNoAvatar = this.ticketsListService.getListColorNoAvatar();
    this.indexNoAvatar = this.ticketsListService.randomInteger(0, 6);
    let getOnUsers = this.usersStateService.getOnUsers().subscribe(data => {
      this.assignedUser = this.usersStateService.getAllUsers().find(item => item.id === this.ticket.assignedUserId);
      this.requestedUser = this.usersStateService.getAllUsers().find(item => item.id === this.ticket.createdUserId);
    })
    this.sub.add(getOnUsers);
    let onSelectAll = this.ticketsStateService.onSelectAll.subscribe(data => {
      this.ticket.selected = data;
      this.cd.markForCheck();
    })
    this.sub.add(onSelectAll);
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
  getCompanyName() {
    let company = this.companiesStateService.getCompanies().find(item => item.id === this.ticket.companyId);
    return (company) ? company.name : '';
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
