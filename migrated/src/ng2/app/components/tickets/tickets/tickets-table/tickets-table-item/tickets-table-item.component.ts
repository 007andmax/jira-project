import { Component, OnInit, Input } from '@angular/core';
import { Ticket } from '../../../class/ticket';
import { UsersStateService } from 'src/ng2/app/states/users/users-state.service';
import { User } from 'src/ng2/app/components/users/class/user';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import * as moment from "moment";

@Component({
  selector: 'app-tickets-table-item',
  templateUrl: './tickets-table-item.component.html',
  styleUrls: ['./tickets-table-item.component.scss']
})
export class TicketsTableItemComponent implements OnInit {
  @Input() ticket: Ticket;
  assignedUser: User;
  requestedUser: User;
  constructor(private usersStateService: UsersStateService,
    private companiesStateService: CompaniesStateService) { }

  ngOnInit() {
    this.assignedUser = this.usersStateService.getAllUsers().find(item => item.id === this.ticket.assignedUserId);
    this.requestedUser = this.usersStateService.getAllUsers().find(item => item.id === this.ticket.createdUserId);
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
      let type = (date.getHours() >= 12) ? 'pm' : 'am';
      return `${(hours < 10 ? '0' + hours : hours)}:${(date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes()} type`
    }
    return moment(date).format('DD MMM YYYY')
  }
getAssignedUserNameForAvatar (user) {
  if (!user.avatar) return `${(user.firstName) ? user.firstName[0].toUpperCase() : ''}${(user.lastName) ? user.lastName[0].toUpperCase() : ''}`;
  return '';
}
  getCompanyName() {
    let company = this.companiesStateService.getCompanies().find(item => item.id === this.ticket.companyId);
    return company.name;
  }
  getClassType() {
    return `priority-icon ${(this.ticket.priorityLevel) ? '--' + this.ticket.priorityLevel.toLowerCase() : ''}`;
  }
}
