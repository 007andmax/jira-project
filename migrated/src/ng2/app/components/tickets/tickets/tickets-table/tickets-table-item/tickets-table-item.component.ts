import { Component, OnInit, Input } from '@angular/core';
import { Ticket } from '../../../class/ticket';
import { UsersStateService } from 'src/ng2/app/states/users/users-state.service';
import { User } from 'src/ng2/app/components/users/class/user';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import * as moment from "moment";
import { StatusColor } from 'src/ng2/app/components/left-panel/left-panel-tickets/tickets-status/class/status-color';
import { TicketsColor } from 'src/ng2/app/components/left-panel/left-panel-tickets/tickets-status/class/tickets-color';
import { TicketsListService } from '../../services/tickets-list.service';

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
  @Input() statusColor: TicketsColor;
  assignedUser: User;
  requestedUser: User;
  constructor(private usersStateService: UsersStateService,
    public ticketsListService: TicketsListService,
    private companiesStateService: CompaniesStateService) { }

  ngOnInit() {
  }
  public getUserName(user) {
    return (user) ? `${user.firstName} ${user.lastName}` : '';
  }
  getNameForAvatar() {
    if (!this.requestedUser) return '';
    if (!this.requestedUser.avatar) return `${(this.requestedUser.firstName) ? this.requestedUser.firstName[0].toUpperCase() : ''}${(this.requestedUser.lastName) ? this.requestedUser.lastName[0].toUpperCase() : ''}`;
    return '';
  }
  getStyleAvatar(user) {
    if (!(user && user.avatar)) {
      return '#16a4fa';
    }
    if (user.id) {
      return `url(${'/users/' + (user.id || 'default') + '/image' + (user.avatar ? '.jpg?t=' + user.avatar.updatedAt :
        '')}) no-repeat`
    } else if (user.avatar && user.avatar.origin && user.avatar.origin.id) {
      return `url(/file/${(user.avatar.origin.id)}.jpg) no-repeat`;
    } else {
      return '#16a4fa';
    }
  };
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
  getStyleStatus(field) {
    return { 'border-color': (this.statusColor && this.listColors) ? this.listColors[this.statusColor[field]].borderColor : null, 'background-color': (this.statusColor && this.listColors) ? this.listColors[this.statusColor[field]].backgroundColor : null, 'color': (this.statusColor && this.listColors) ? this.listColors[this.statusColor[field]].borderColor : null }
  }
  getClassType() {
    return `priority-icon ${(this.ticket.priorityLevel && this.ticket.priorityLevel !== "MEDIUM") ? '--' + this.ticket.priorityLevel.toLowerCase() : ''}`;
  }
}
