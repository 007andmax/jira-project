import { Component, Input, OnInit } from '@angular/core';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { QuotePreview } from '../../class/quote-preview';
import * as moment from "moment";
import { Company } from 'src/app/interfaces/company/company';

@Component({
  selector: 'app-quote-aside-preview-body',
  templateUrl: './quote-aside-preview-body.component.html',
  styleUrls: ['./quote-aside-preview-body.component.scss']
})
export class QuoteAsidePreviewBodyComponent implements OnInit {
  @Input() quote: QuotePreview;
  currentCompany: any;
  quoteCompany: Company;
  constructor(public companiesStateService: CompaniesStateService) { }

  ngOnInit() {
    this.currentCompany = this.companiesStateService.getCurrentCompany();
    if (this.quote.company) this.quoteCompany = this.companiesStateService.getCompanies().find(item => item.id === this.quote.company.id);
  }
  getShippingAddress() {
    return this.quoteCompany.companyInfo.addresses.find(item => item.isPrimary);
  }
  getBillingAddress() {
    return this.quoteCompany.companyInfo.addresses.find(item => !item.isPrimary);
  }
  public getDate(date) {
    return moment(new Date(date)).format('DD MMM YYYY');
  }
  getSubTotalServices() {
    return this.quote.services.reduce((a, b) => a + b.sum, 0);
  }
  getSubTotalProducts() {
    return this.quote.products.reduce((a, b) => a + b.sum, 0);
  }
  getTotalTaxes() {
    let totalTaxes = 0;
    totalTaxes += this.quote.services.reduce((a, b) => a + b.taxSum, 0);
    totalTaxes += this.quote.products.reduce((a, b) => a + b.taxSum, 0);
    return totalTaxes;
  }
  getSelectedTaxes(taxes) {
    return taxes.map(item => {
      return `${item.name} ${item.rate}%`;
    }).join("<br>");
  }
  public calculateServiceDiscount() {
    let sum = 0;
    this.quote.services.forEach(item => {
      if (item.discountType == "PERCENT") sum += (item.quantity * item.rate * (Number(item.discountAmount) || 0) / 100);
      if (item.discountType == "FIXED") sum += (Number(item.discountAmount) || 0);
    })
    return sum;
  }
  public trackById(index, item) {
    return item.versionedId.id;
  }
}
