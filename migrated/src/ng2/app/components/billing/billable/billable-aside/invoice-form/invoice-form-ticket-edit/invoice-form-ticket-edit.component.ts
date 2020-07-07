import { Component, OnInit, Input } from '@angular/core';
import { InvoiceProfileTicket } from '../../../class/invoice-profile-ticket';
import * as moment from "moment";
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
@Component({
  selector: 'app-invoice-form-ticket-edit',
  templateUrl: './invoice-form-ticket-edit.component.html',
  styleUrls: ['./invoice-form-ticket-edit.component.scss']
})
export class InvoiceFormTicketEditComponent implements OnInit {
  @Input() ticket:InvoiceProfileTicket;
  currentCompany;
  constructor(private companiesStateService: CompaniesStateService) { }

  ngOnInit() {
    this.currentCompany = this.companiesStateService.getCurrentCompany();
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
