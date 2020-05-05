import { Component, OnInit, Input } from '@angular/core';
import { TicketProfileUpdate } from '../../../class/ticket-profile-update';
import { TicketProfileShare } from '../../../class/ticket-profile-share';
import { TicketsListService } from '../../../services/tickets-list.service';
import * as moment from "moment";

@Component({
  selector: 'app-ticket-profile-updates-product',
  templateUrl: './ticket-profile-updates-product.component.html',
  styleUrls: ['./ticket-profile-updates-product.component.scss']
})
export class TicketProfileUpdatesProductComponent implements OnInit {
  @Input() update: TicketProfileUpdate;
  constructor(public ticketsListService: TicketsListService) { }

  ngOnInit() {
  }
  public getTotal(price, quantity) {
    return price * quantity;
  }
  public getDate(date) {
    return moment(new Date(date)).format('DD MMM YYYY');
  }
}
