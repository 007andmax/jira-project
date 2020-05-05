import { Component, OnInit, Input } from '@angular/core';
import { TicketProfileShare } from '../../../class/ticket-profile-share';
import { TicketsListService } from '../../../services/tickets-list.service';

@Component({
  selector: 'app-ticket-profile-updates-footer',
  templateUrl: './ticket-profile-updates-footer.component.html',
  styleUrls: ['./ticket-profile-updates-footer.component.scss']
})
export class TicketProfileUpdatesFooterComponent implements OnInit {
  @Input() shares:Array<TicketProfileShare> = [];
  constructor(public ticketsListService: TicketsListService) { }

  ngOnInit() {
  }

}
