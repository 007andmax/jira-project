import { Component, Input, OnInit } from '@angular/core';
import { MergeTickets } from '../class/merge-tickets';
import { Ticket } from '../../../class/ticket';
import * as moment from 'moment';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { StatusColor } from '../../../class/status-color';

@Component({
  selector: 'app-merge-tickets-edit-item',
  templateUrl: './merge-tickets-edit-item.component.html',
  styleUrls: ['./merge-tickets-edit-item.component.scss']
})
export class MergeTicketsEditItemComponent implements OnInit {
  @Input() mergeTicket: MergeTickets;
  @Input() tickets: Array<Ticket> = [];
  @Input() listColors: Array<StatusColor> = [];
  editNote: boolean = false;
  constructor(private companiesStateService: CompaniesStateService) { }

  ngOnInit() {

  }
  getCreatAt() {
    let date = new Date(this.getTicket().createdAt);
    return `${moment(new Date(date)).format('DD MMM YYYY')}`;
  }
  getCompanyName() {
    if (!this.getTicket().companyId) return '';
    let find = this.companiesStateService.getCompanies().find(item => item.id === this.getTicket().companyId);
    return (find) ? find.name : '';
  }
  getTicket() {
    return this.tickets.find(item => item.id == this.mergeTicket.ticketId);
  }

  public toggleEditNote() {
    this.editNote = !this.editNote;
  }
  onChangeNote(event) {
    this.mergeTicket.note = event.target.value;
  }
  onChangeSubject(event) {
    this.mergeTicket.subject = event.target.value;
  }
}
