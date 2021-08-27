import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';
import { StatusColor } from 'src/app/components/left-panel/left-panel-tickets/tickets-status/class/status-color';
import { TicketsColor } from 'src/app/components/left-panel/left-panel-tickets/tickets-status/class/tickets-color';
import { Ticket } from 'src/app/components/tickets/class/ticket';
import { TicketsListService } from 'src/app/components/tickets/tickets/services/tickets-list.service';


@Component({
  selector: 'users-aside-detail-tickets-item',
  templateUrl: './users-aside-detail-tickets-item.component.html',
  styleUrls: ['./users-aside-detail-tickets-item.component.scss'],
  providers: [TicketsListService]
})
export class UsersAsideDetailTicketsItemComponent implements OnInit {

  @Input() ticket: Ticket;

  @Input() listColors: Array<StatusColor> = [];
  @Input() statusColor: TicketsColor;
  @Input() selected: boolean = false;

  listColorNoAvatar = ['#0cdeaa', '#16a4fa', '#7c77cb', '#ffb937'];

  constructor(public ticketsListService: TicketsListService,) { }

  ngOnInit() {

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

  getStyleStatus(field) {
    return { 'border-color': (this.statusColor && this.listColors) ? this.listColors[this.statusColor[field]].borderColor : null, 'background-color': (this.statusColor && this.listColors) ? this.listColors[this.statusColor[field]].backgroundColor : null, 'color': (this.statusColor && this.listColors) ? this.listColors[this.statusColor[field]].borderColor : null }
  }
  getClassType() {
    return `priority-icon ${(this.ticket.priorityLevel && this.ticket.priorityLevel !== "MEDIUM") ? '--' + this.ticket.priorityLevel.toLowerCase() : ''}`;
  }
  public trackById(index, item) {
    return item.id;
  }

}
