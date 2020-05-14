import { Component, OnInit, Input } from '@angular/core';
import { TicketProfile } from '../../class/ticket-profile';
import { StatusColor } from 'src/ng2/app/components/left-panel/left-panel-tickets/tickets-status/class/status-color';
import { TicketsColor } from 'src/ng2/app/components/left-panel/left-panel-tickets/tickets-status/class/tickets-color';
import { TicketsStateService } from 'src/ng2/app/states/tickets/tickets-state.service';
import { TitleListType } from '../../tickets-header/class/title-list-type';
import { TicketsService } from 'src/ng2/app/services/tickets/tickets.service';
import { NotificationStateService } from 'src/ng2/app/components/shared/notification/services/notification-state.service';

@Component({
  selector: 'app-ticket-change-status',
  templateUrl: './ticket-change-status.component.html',
  styleUrls: ['./ticket-change-status.component.scss']
})
export class TicketChangeStatusComponent implements OnInit {
  @Input() ticketProfile: TicketProfile = new TicketProfile();
  listColors: Array<StatusColor> = [];
  statusColor: TicketsColor;
  list: Array<TitleListType> = [new TitleListType('In Progress', 'IN_PROGRESS'),
  new TitleListType('On Hold', 'ON_HOLD')];
  constructor(private ticketsStateService:TicketsStateService,
    private notificationStateService: NotificationStateService,
    private ticketsService: TicketsService,) { }

  ngOnInit() {
    this.ticketsStateService.getOnInitColor().subscribe(data => {
      this.listColors = data;
    })
    this.ticketsStateService.getOnInitStatus().subscribe(data => {
      this.statusColor = data;
    })
  }
  getStyleStatus(field) {
    return { 'border-color': (this.statusColor && this.listColors) ? this.listColors[this.statusColor[field]].borderColor : null, 'background-color': (this.statusColor && this.listColors) ? this.listColors[this.statusColor[field]].backgroundColor : null, 'color': (this.statusColor && this.listColors) ? this.listColors[this.statusColor[field]].borderColor : null }
  }
  changeTicketStatus(type,title) {
    this.ticketsService.changeStatus(this.ticketProfile.id, type).subscribe((data: any) => {
      this.notificationStateService.oninitShowNotification(`The tickets “${this.ticketProfile.number}” status has been changed to "${title}"`);
    })
   
  }
}
