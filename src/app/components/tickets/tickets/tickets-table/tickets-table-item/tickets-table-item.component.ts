import { Component, OnInit, Input } from '@angular/core';
import { Ticket } from '../../../class/ticket';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { User } from 'src/app/components/users/class/user';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import * as moment from "moment";
import { TicketsListService } from '../../services/tickets-list.service';
import { TicketStatus } from 'src/app/components/setting/customizable-lists/class/ticket-status';
import { StatusColor } from '../../../class/status-color';

@Component({
  selector: 'app-tickets-table-item',
  templateUrl: './tickets-table-item.component.html',
  styleUrls: ['./tickets-table-item.component.scss'],
  providers: [TicketsListService]
})
export class TicketsTableItemComponent implements OnInit {
  ticket: Ticket;
  @Input() set setTicket(value) {
    this.ticket = value;
    this.assignedUser = this.usersStateService.getAllUsers().find(item => item.id === this.ticket.assignedUserId);
    this.requestedUser = this.usersStateService.getAllUsers().find(item => item.id === this.ticket.createdUserId);
  };
  @Input() listColors: Array<StatusColor> = [];
  @Input() selected: boolean = false;
  @Input() ticketsStatus: Array<TicketStatus> = [];
  assignedUser: User;
  requestedUser: User;
  indexNoAvatar: number = 0;
  listColorNoAvatar = ['#0cdeaa', '#16a4fa', '#7c77cb', '#ffb937'];

  constructor(private usersStateService: UsersStateService,
    public ticketsListService: TicketsListService,
    private companiesStateService: CompaniesStateService) { }

  ngOnInit() {
    this.indexNoAvatar = this.ticketsListService.randomInteger(0, 3);
  }
  public getUserName(user) {
    return (user) ? `${user.firstName} ${user.lastName}` : '';
  }

  getNameForAvatar() {
    if (!this.requestedUser) return '';
    if (!this.requestedUser.avatar) return `${(this.requestedUser.firstName) ? this.requestedUser.firstName[0].toUpperCase() : ''}${(this.requestedUser.lastName) ? this.requestedUser.lastName[0].toUpperCase() : ''}`;
    return '';
  }
  getCreateAt() {
    let date = new Date(this.ticket.createdAt);
    let currentDate = new Date();
    if (date.getFullYear() === currentDate.getFullYear() && date.getMonth() === currentDate.getMonth() && date.getDate() === currentDate.getDate()) {
      let hours = (date.getHours() > 12) ? date.getHours() - 12 : date.getHours();
      let type = (date.getHours() >= 12) ? 'PM' : 'AM';
      return `${(hours < 10 ? '0' + hours : hours)}:${(date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes()} ${type}`;
    }
    return moment(date).format('DD MMM')
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
    return { 'border-color': (this.listColors) ? this.listColors[find.color].borderColor : null, 'color': (this.listColors) ? this.listColors[find.color].borderColor : null }
  }
  getClassType() {
    return `priority-icon ${(this.ticket.priorityLevel && this.ticket.priorityLevel !== "MEDIUM") ? '--' + this.ticket.priorityLevel.toLowerCase() : ''}`;
  }
  public trackById(index, item) {
    return item.id;
  }
}
