import { Component, Input, OnInit } from '@angular/core';
import { TicketProfileShare } from '../../../../class/ticket-profile-share';
import * as moment from "moment";
import { TicketsListService } from '../../../../services/tickets-list.service';
import { TicketProfileProduct } from '../../../../class/ticket-profile-product';

@Component({
  selector: 'ticket-detail-profile-updates-product-header-info',
  templateUrl: './ticket-detail-profile-updates-product-header-info.component.html',
  styleUrls: ['./ticket-detail-profile-updates-product-header-info.component.scss']
})
export class TicketDetailProfileUpdatesProductHeaderInfoComponent implements OnInit {
  @Input() product: TicketProfileProduct;
  @Input() shares: Array<TicketProfileShare> = [];
  @Input() date: number = 0;
  constructor(public ticketsListService: TicketsListService) { }

  ngOnInit() {
  }
  public getDate() {
    return `${moment(new Date(this.date)).format('DD MMM YYYY')} at ${moment(new Date(this.date)).format('hh:mm A')}`;
  }
  public getDateProduct(date) {
    return moment((date) ? new Date(date) : new Date()).format('DD MMM YYYY');
  }
  public trackByIndex(index, item) {
    return index;
  }

}
