import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { Ticket } from '../../../class/ticket';
import { TicketProfile } from '../../class/ticket-profile';
import { TicketsFilter } from '../../class/tickets-filter';

@Component({
  selector: 'ticket-detail-tickets',
  templateUrl: './ticket-detail-tickets.component.html',
  styleUrls: ['./ticket-detail-tickets.component.scss']
})
export class TicketDetailTicketsComponent implements OnInit {
  @Output() onShowMore = new EventEmitter<any>();
  toggleContainer: boolean = true;
  @Input() ticketProfile: TicketProfile = new TicketProfile();
  ticketsFilter: TicketsFilter = new TicketsFilter();
  tickets: Array<Ticket> = [];
  constructor(private ticketsService: TicketsService,
    public cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.ticketsFilter.setListType("ALL");
    this.ticketsFilter.setOffset(0);
    this.ticketsFilter.setSize(3);
    this.ticketsFilter.setCompanies([this.ticketProfile.company]);
    this.ticketsService.getTickets(this.ticketsFilter.getListTupe(), this.ticketsFilter.getDataForRequest()).subscribe((data: Array<Ticket>) => {
      this.tickets = data;
      this.cd.detectChanges();
    })
  }
  showMore() {
    this.onShowMore.emit(null);
  }
  getCreateAt(createdAt) {
    return moment(new Date(createdAt)).format('DD MMM YYYY')
  }

}
