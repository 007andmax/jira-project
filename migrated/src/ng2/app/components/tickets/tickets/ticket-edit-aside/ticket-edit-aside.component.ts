import { Component, OnInit } from '@angular/core';
import { TicketsStateService } from 'src/ng2/app/states/tickets/tickets-state.service';
import { TicketProfile } from '../class/ticket-profile';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import * as moment from "moment";
import { StatusColor } from '../../../left-panel/left-panel-tickets/tickets-status/class/status-color';
import { TicketsColor } from '../../../left-panel/left-panel-tickets/tickets-status/class/tickets-color';
@Component({
  selector: 'app-ticket-edit-aside',
  templateUrl: './ticket-edit-aside.component.html',
  styleUrls: ['./ticket-edit-aside.component.scss']
})
export class TicketEditAsideComponent implements OnInit {
  ticketProfile: TicketProfile = new TicketProfile();
  opened = false;
  modeSubject = 'view';
  modeDescription = 'view';
  listColors: Array<StatusColor> = [];
  statusColor: TicketsColor;
  constructor(private ticketsStateService: TicketsStateService,
    private companiesStateService: CompaniesStateService) { }

  ngOnInit() {
    this.ticketsStateService.getOnEditTicket().subscribe(data => {
      this.ticketProfile = data;
      this.opened = true;
    })
    this.ticketsStateService.getOnInitColor().subscribe(data => {
      this.listColors = data;
    })
    this.ticketsStateService.getOnInitStatus().subscribe(data => {
      this.statusColor = data;
    })
  }

  getCompantName() {
    let find = this.companiesStateService.getCompanies().find(item => item.id === this.ticketProfile.companyId);
    return (find) ? find.name : '';
  }
  getNameCreateUser() {
    if (!this.ticketProfile.createdUser) return '';
    return `${this.ticketProfile.createdUser.firstName} ${this.ticketProfile.createdUser.lastName}`
  }
  getAssignedUserNameForAvatar(user) {
    if (!user) return '';
    if (!user.avatar) return `${(user.firstName) ? user.firstName[0].toUpperCase() : ''}${(user.lastName) ? user.lastName[0].toUpperCase() : ''}`;
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
  getCreatAt() {
    let date = new Date(this.ticketProfile.createdAt);
    let hours = (date.getHours() > 12) ? date.getHours() - 12 : date.getHours();
    let type = (date.getHours() >= 12) ? 'pm' : 'am';
    return `${moment(date).format('DD MMM YYYY')}, ${(hours < 10 ? '0' + hours : hours)}:${(date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes()} ${type}`
  }
  getStyleStatus(field) {
    return {'border-color' : (this.statusColor && this.listColors) ?  this.listColors[this.statusColor[field]].borderColor : null,'background-color' : (this.statusColor && this.listColors) ?  this.listColors[this.statusColor[field]].backgroundColor : null,'color' : (this.statusColor && this.listColors) ?  this.listColors[this.statusColor[field]].borderColor : null}
  }
  parseTicketSource() {
    if (!this.ticketProfile.ticketSource) {
      return '';
    }
    var words = this.ticketProfile.ticketSource.split('_'),
      result = '';
    for (var i = 0, len = words.length; i < len; i++) {
      var word = words[i];
      result += word[0].toUpperCase() + word.slice(1).toLowerCase();
      if (i !== len - 1) {
        result += ' ';
      }
    }
    return result;
  };
  getClassType() {
    return `priority-icon ticket-edit-aside__ticket-subject-flag ${(this.ticketProfile.priorityLevel && this.ticketProfile.priorityLevel !== "MEDIUM") ? '--' + this.ticketProfile.priorityLevel.toLowerCase() : ''}`;
  }
}
