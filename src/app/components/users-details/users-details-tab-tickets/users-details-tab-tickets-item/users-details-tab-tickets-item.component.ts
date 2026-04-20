import { Component, Input, OnInit } from '@angular/core';
import { TicketsListService } from 'src/app/components/tickets/tickets/services/tickets-list.service';
import * as moment from 'moment';
import { TicketStatus } from 'src/app/components/setting/ticket-settings-page/tickets-status/class/ticket-status';
import { StatusColor } from 'src/app/components/tickets/class/status-color';
import { Ticket } from 'src/app/components/tickets/class/ticket';

@Component({
    selector: 'app-users-details-tab-tickets-item',
    templateUrl: './users-details-tab-tickets-item.component.html',
    styleUrls: ['./users-details-tab-tickets-item.component.scss'],
    providers: [TicketsListService],
    standalone: true
})
export class UsersDetailsTabTicketsItemComponent implements OnInit {
  @Input() ticket: Ticket;
  @Input() listColors: Array<StatusColor> = [];
  @Input() selected: boolean = false;
  @Input() ticketsStatus: Array<TicketStatus> = [];

  constructor(public ticketsListService: TicketsListService,) { }

  ngOnInit() {

  }
  getCreateAt() {
    let date = new Date(this.ticket.createdAt);
    let currentDate = new Date();
    if (date.getFullYear() === currentDate.getFullYear() && date.getMonth() === currentDate.getMonth() && date.getDate() === currentDate.getDate()) {
      return `${moment(new Date(date)).format('hh:mm A')}`;
    }
    return moment(date).format('DD MMM')
  }

  getStyleStatus(name) {
    let find = this.ticketsStatus.find(item => item.name == name);
    return {
      'border-color': (this.listColors.length > 0 && find) ? this.listColors[find.color].textColor : null,
      'background-color': (this.listColors.length > 0 && find) ? this.listColors[find.color].borderColor : null, 'color': (this.listColors.length > 0 && find) ? this.listColors[find.color].textColor : null
    }
  }
  getClassType() {
    return `priority-icon ${(this.ticket.priorityLevel && this.ticket.priorityLevel.name !== "MEDIUM") ? '--' + this.ticket.priorityLevel.name.toLowerCase() : ''}`;
  }
  public trackById(index, item) {
    return item.id;
  }

}
