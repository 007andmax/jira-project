import { Component, OnInit, Input } from '@angular/core';
import { TicketProfile } from '../../class/ticket-profile';
import { StatusColor } from 'src/app/components/left-panel/left-panel-tickets/tickets-status/class/status-color';
import { TicketsColor } from 'src/app/components/left-panel/left-panel-tickets/tickets-status/class/tickets-color';
import { TicketsStateService } from 'src/app/states/tickets/tickets-state.service';
import { TitleListType } from '../../tickets-header/class/title-list-type';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { NotificationStateService } from 'src/app/components/shared/notification/services/notification-state.service';
import { ToastrService } from 'ngx-toastr';
import { AppStateService } from 'src/app/states/app/app-state.service';

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
  constructor(private ticketsStateService: TicketsStateService,
    private notificationStateService: NotificationStateService,
    private toastrService: ToastrService,
    private appStateService: AppStateService,
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
  changeTicketStatus(type, title) {
    this.ticketsService.changeStatus(this.ticketProfile.id, type).subscribe((data: any) => {
      this.notificationStateService.oninitShowNotification(`The tickets “${this.ticketProfile.number}” status has been changed`);
      this.toastrService.success(`The tickets “${this.ticketProfile.number}” status has been changed`);
      this.appStateService.changeDetectorRef();
    })

  }
}
