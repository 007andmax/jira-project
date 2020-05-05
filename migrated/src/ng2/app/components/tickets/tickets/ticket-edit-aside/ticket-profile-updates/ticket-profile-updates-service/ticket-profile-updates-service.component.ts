import { Component, OnInit, Input } from '@angular/core';
import { TicketProfileUpdate } from '../../../class/ticket-profile-update';
import { TicketsListService } from '../../../services/tickets-list.service';
import * as moment from "moment";

@Component({
  selector: 'app-ticket-profile-updates-service',
  templateUrl: './ticket-profile-updates-service.component.html',
  styleUrls: ['./ticket-profile-updates-service.component.scss']
})
export class TicketProfileUpdatesServiceComponent implements OnInit {
  @Input() update: TicketProfileUpdate;
  constructor(public ticketsListService: TicketsListService) { }

  ngOnInit() {
  }
  public getDate(date) {
    return moment(new Date(date)).format('DD MMM YYYY');
  }
  public getTime(time) {
    return moment(new Date(time)).format('hh:mm A');
  }
  public getDuration(quantity) {
    var timeInMinutes = quantity * 60,
    hours = Math.floor(timeInMinutes / 60),
    minutes = Math.round(timeInMinutes - (hours * 60));
    return`${(hours < 10) ? '0' + hours : hours} : ${(minutes < 10) ? '0' + minutes : minutes}`
  }
}
