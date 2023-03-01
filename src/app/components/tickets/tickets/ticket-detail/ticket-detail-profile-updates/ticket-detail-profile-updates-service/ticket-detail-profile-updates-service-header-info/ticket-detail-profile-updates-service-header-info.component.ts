import { Component, Input, OnInit } from '@angular/core';
import { TicketProfileService } from '../../../../class/ticket-profile-service';
import { TicketProfileShare } from '../../../../class/ticket-profile-share';
import { TicketsListService } from '../../../../services/tickets-list.service';
import * as moment from "moment";

@Component({
  selector: 'ticket-detail-profile-updates-service-header-info',
  templateUrl: './ticket-detail-profile-updates-service-header-info.component.html',
  styleUrls: ['./ticket-detail-profile-updates-service-header-info.component.scss']
})
export class TicketDetailProfileUpdatesServiceHeaderInfoComponent implements OnInit {

  @Input() service: TicketProfileService;
  @Input() shares: Array<TicketProfileShare> = [];
  @Input() date: number = 0;
  constructor(public ticketsListService: TicketsListService) { }

  ngOnInit() {
  }
  public getDate() {
    return `${moment(new Date(this.date)).format('DD MMM YYYY')} at ${moment(new Date(this.date)).format('hh:mm A')}`;
  }
  public getDateService(date) {
    return moment((date) ? new Date(date) : new Date()).format('DD MMM YYYY');
  }
  public trackByIndex(index, item) {
    return index;
  }
}
