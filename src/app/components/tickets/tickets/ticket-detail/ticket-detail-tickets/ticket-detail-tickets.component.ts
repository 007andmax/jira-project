import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { Ticket } from '../../../class/ticket';
import { TicketProfile } from '../../class/ticket-profile';
import { TicketsFilter } from '../../class/tickets-filter';
import { TicketStateService } from '../../ticket-edit-aside/services/ticket-state.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { TicketsStateService } from 'src/app/states/tickets/tickets-state.service';

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
    private ticketStateService: TicketStateService,
    private companiesStateService: CompaniesStateService,
    private ticketsStateService: TicketsStateService,
    public cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.initDefaultTicketsList();
    this.ticketsStateService.getOnUpdateTicket().subscribe(data => {
      let index = this.tickets.findIndex(item => item.id == data.id);
      if (index > -1) this.tickets[index] = new Ticket(data);
      this.cd.detectChanges();
    })
  }
  public initDefaultTicketsList() {
    this.ticketsFilter.setListType("ALL");
    this.ticketsFilter.setOffset(0);
    this.ticketsFilter.setSize(3);
    this.ticketsFilter.setCompanies([this.ticketProfile.company]);
    this.ticketsService.getTickets(this.ticketsFilter.getListTupe(), this.ticketsFilter.getDataForRequest()).subscribe((data: Array<Ticket>) => {
      this.tickets = data;
      this.cd.detectChanges();
    })
  }
  editTicket(id) {
    this.ticketStateService.setTicketRoutingId(id);
    const url = `/#/${this.companiesStateService.getCurrentCompany().name.replaceAll(' ', '')}/ticket/${id}`;
    window.open(url, '_blank');
  }
  showMore() {
    this.onShowMore.emit(null);
  }
  getCreateAt(createdAt) {
    return moment(new Date(createdAt)).format('DD MMM YYYY')
  }
  public trackById(index, item) {
    return item.id;
  }
}
