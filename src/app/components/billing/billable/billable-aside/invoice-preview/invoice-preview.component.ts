import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BillableStateService } from 'src/app/states/billable/billable-state.service';
import { Subscription } from 'rxjs';
import * as moment from "moment";
import { InvoiceLock } from '../../class/invoice-lock';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { CompanyProfile } from 'src/app/components/companies/class/company-profile';
import { InvoiceTaxNumber } from '../../class/invoice-tax-number';
import { InvoiceNote } from '../../class/invoice-note';
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
  selectedNote: InvoiceNote = null;
  currentCompany: any;
  constructor(private billableStateService: BillableStateService,
    private companiesStateService: CompaniesStateService) { }

  ngOnInit() {
    this.selectedNote = this.billableStateService.getRegularNote();
    this.currentCompany = this.companiesStateService.getCurrentCompany();
  }
  getCompanyLogoUrl() {
    if (this.currentCompany && this.currentCompany.logo && this.currentCompany.logo && this.currentCompany.logo.base64 && !this.currentCompany.logo.cropped) return this.currentCompany.logo.base64;
    if (this.currentCompany && this.currentCompany.logo && this.currentCompany.logo.cropped && this.currentCompany.logo.cropped.id) return `/file/${this.currentCompany.logo.cropped.id}`;
    if (this.currentCompany && this.currentCompany.logo && this.currentCompany.logo.origin && this.currentCompany.logo.origin.id) return `/file/${this.currentCompany.logo.origin.id}`;
    return '/company/default/logo.jpg';
  }
  getDuration(input) {
    let timeInMinutes = input * 60,
      hours = Math.floor(timeInMinutes / 60),
      minutes = Math.round(timeInMinutes - (hours * 60));
    return (hours >= 10 ? hours : '0' + hours) + ':' + (minutes >= 10 ? minutes : '0' + minutes) + ' hr(s)';
  }
  getSelectedTaxes(taxes) {
    return taxes.map(item => {
      return `${item.name} ${item.rate}%`;
    }).join("<br>");
  }
  public getDate(date) {
    return moment(new Date(date)).format('DD MMM YYYY');
  }
  public getDateTicket(date) {
    return moment(new Date(date)).format('DD/MM/YYYY');
  }
  public trackByIndex(index, item) {
    return index;
  }
  public trackById(index, item) {
    return item.id;
  }
}
