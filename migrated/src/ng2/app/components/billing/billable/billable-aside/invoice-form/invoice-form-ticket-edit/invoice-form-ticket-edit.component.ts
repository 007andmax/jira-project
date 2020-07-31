import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { InvoiceProfileTicket } from '../../../class/invoice-profile-ticket';
import * as moment from "moment";
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { TicketsService } from 'src/ng2/app/services/tickets/tickets.service';
@Component({
  selector: 'app-invoice-form-ticket-edit',
  templateUrl: './invoice-form-ticket-edit.component.html',
  styleUrls: ['./invoice-form-ticket-edit.component.scss']
})
export class InvoiceFormTicketEditComponent implements OnInit {
  @Input() ticket: InvoiceProfileTicket;
  @Output() onUpdateSubject = new EventEmitter();
  currentCompany;
  constructor(private companiesStateService: CompaniesStateService,
    private ticketsService: TicketsService,) { }

  ngOnInit() {
    this.currentCompany = this.companiesStateService.getCurrentCompany();
  }
  public getDate(date) {
    return moment(new Date(date)).format('DD/MM/YYYY');
  }
  onChangeSubject() {
    this.ticketsService.changeSubjectNoteTicket(this.ticket.id, this.ticket.subject, this.ticket.note).subscribe(data => {
      this.onUpdateSubject.emit(this.ticket.subject);
    })
  }
  getDuration(input) {
    let timeInMinutes = input * 60,
      hours = Math.floor(timeInMinutes / 60),
      minutes = Math.round(timeInMinutes - (hours * 60));
    return (hours >= 10 ? hours : '0' + hours) + ':' + (minutes >= 10 ? minutes : '0' + minutes) + ' hr(s)';
  }
  public trackById(index, item) {
    return item.id;
  }
}
