import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { InvoiceProfileTicket } from '../../../class/invoice-profile-ticket';
import * as moment from "moment";

@Component({
  selector: 'app-invoice-form-ticket-info',
  templateUrl: './invoice-form-ticket-info.component.html',
  styleUrls: ['./invoice-form-ticket-info.component.scss']
})
export class InvoiceFormTicketInfoComponent implements OnInit {
  @Input() ticket: InvoiceProfileTicket;
  @Input() ticketsLength: number = 0;
  @Output() onDelete = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }
  delete() {
    this.onDelete.emit(null);
  }
  public getDate(date) {
    return moment(new Date(date)).format('DD/MM/YYYY');
  }
  getDuration(input) {
    let timeInMinutes = input * 60,
      hours = Math.floor(timeInMinutes / 60),
      minutes = Math.round(timeInMinutes - (hours * 60));
    return (hours >= 10 ? hours : '0' + hours) + ':' + (minutes >= 10 ? minutes : '0' + minutes) + ' hr(s)';

  }
}
