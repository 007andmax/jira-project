import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import * as moment from "moment";
import { InvoiceLock } from '../../class/invoice-lock';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { CompanyProfile } from 'src/app/components/companies/class/company-profile';
import { InvoiceTaxNumber } from '../../class/invoice-tax-number';

@Component({
  selector: 'app-invoice-preview',
  templateUrl: './invoice-preview.component.html',
  styleUrls: ['./invoice-preview.component.scss']
})
export class InvoicePreviewComponent implements OnInit {
  @Input() invoiceNumber: string;
  @Input() invoice: InvoiceLock;
  @Input() company: CompanyProfile = new CompanyProfile();
  @Input() invoiceTaxNumber: InvoiceTaxNumber;
  opened: boolean = false;
  sub: Subscription = new Subscription();
  currentCompany: any;
  constructor(public companiesStateService: CompaniesStateService) { }

  ngOnInit() {
    this.currentCompany = this.companiesStateService.getCurrentCompany();
  }
  getCurrentCompanyPhone() {
    return (this.currentCompany.addresses[0].phoneNumbers.length > 0) ? this.currentCompany.addresses[0].phoneNumbers[0].number : ''
  }
  getContactsPhone() {
    return (this.company.contacts[0].phoneNumbers && this.company.contacts[0].phoneNumbers.length > 0) ? this.company.contacts[0].phoneNumbers[0].number : ''
  }
  getDuration(input) {
    let timeInMinutes = input * 60,
      hours = Math.floor(timeInMinutes / 60),
      minutes = Math.round(timeInMinutes - (hours * 60));
    return (hours >= 10 ? hours : '0' + hours) + ':' + (minutes >= 10 ? minutes : '0' + minutes) + ' hr(s)';
  }
  getServiceTaxes(service) {
    if (service.taxesForSingleItem.length > 0) return this.getSelectedTaxes(service.taxesForSingleItem);
    if (service.taxesForSingleItem.length == 0) return this.getSelectedTaxes(service.item.taxes || []);
  }
  getSelectedTaxes(taxes) {
    return taxes.map(item => {
      return `${item.name} ${item.rate}%`;
    }).join("<br>");
  }
  public getDate(date) {
    return moment(new Date(date)).format('DD MMM YYYY');
  }
  public trackByIndex(index, item) {
    return index;
  }
  public trackById(index, item) {
    return item.id;
  }
}
