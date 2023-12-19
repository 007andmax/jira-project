import { Component, Input, OnInit } from '@angular/core';
import { TicketProfileShare } from '../../../class/ticket-profile-share';
import { TicketsListService } from '../../../services/tickets-list.service';
import * as moment from "moment";

@Component({
  selector: 'ticket-detail-profile-updates-header-info',
  templateUrl: './ticket-detail-profile-updates-header-info.component.html',
  styleUrls: ['./ticket-detail-profile-updates-header-info.component.scss']
})
export class TicketDetailProfileUpdatesHeaderInfoComponent implements OnInit {

  @Input() otherRecipients: Array<string> = [];
  @Input() shares: Array<TicketProfileShare> = [];
  @Input() date: number = 0;
  constructor(public ticketsListService: TicketsListService) { }

  ngOnInit() {
  }
  public getDate() {
    return `${moment(new Date(this.date)).format('DD MMM YYYY')} at ${moment(new Date(this.date)).format('hh:mm A')}`;
  }
  public trackByIndex(index, item) {
    return index;
  }
}
