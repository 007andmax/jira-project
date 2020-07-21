import { Component, OnInit, Input } from '@angular/core';
import * as moment from "moment";
import { Invoice } from '../class/invoice';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
@Component({
  selector: 'app-invoices-item',
  templateUrl: './invoices-item.component.html',
  styleUrls: ['./invoices-item.component.scss']
})
export class InvoicesItemComponent implements OnInit {
  @Input() invoice:Invoice;
  company:any;
  constructor(private companiesStateService:CompaniesStateService) { }

  ngOnInit() {
    this.company = this.companiesStateService.getCompanies().find(item => item.id === this.invoice.companyId);
  }
  getDate(date) {
    return (date) ?  moment(date).format('DD MMM YYYY') : '';
  }
}
