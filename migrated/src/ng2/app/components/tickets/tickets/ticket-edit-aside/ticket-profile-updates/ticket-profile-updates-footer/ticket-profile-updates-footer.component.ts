import { Component, OnInit, Input } from '@angular/core';
import { TicketProfileShare } from '../../../class/ticket-profile-share';
import { TicketsListService } from '../../../services/tickets-list.service';
import * as moment from "moment";

@Component({
  selector: 'app-ticket-profile-updates-footer',
  templateUrl: './ticket-profile-updates-footer.component.html',
  styleUrls: ['./ticket-profile-updates-footer.component.scss']
})
export class TicketProfileUpdatesFooterComponent implements OnInit {
  @Input() shares:Array<TicketProfileShare> = [];
  @Input() date:number = 0;
  constructor(public ticketsListService: TicketsListService) { }

  ngOnInit() {
  }

  public getDate() {
    let now = new Date();
    let date = new Date(this.date);
    if (now.getDate() == date.getDate() && now.getMonth() == date.getMonth() && now.getFullYear() == date.getFullYear())  return moment(new Date(this.date)).format('hh:mm A');
    return moment(new Date(this.date)).format('DD MMM');
  }

}
