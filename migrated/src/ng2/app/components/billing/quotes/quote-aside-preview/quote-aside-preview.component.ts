import { Component, OnInit } from '@angular/core';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { QuotePreview } from '../class/quote-preview';
import { QuoteStateService } from '../quote-create/quote-state.service';
import * as moment from "moment";
import { Company } from 'src/ng2/app/interfaces/company/company';
import { QuoteService } from 'src/ng2/app/services/quote/quote.service';

@Component({
  selector: 'app-quote-aside-preview',
  templateUrl: './quote-aside-preview.component.html',
  styleUrls: ['./quote-aside-preview.component.scss']
})
export class QuoteAsidePreviewComponent implements OnInit {
  quote: QuotePreview;
  showPreloader: boolean = true;
  currentCompany: any;
  quoteCompany: Company;
  open: boolean = false;
  constructor(private quoteStateService: QuoteStateService,
    private quoteServices: QuoteService,
    private companiesStateService: CompaniesStateService) { }

  ngOnInit() {

    this.quoteStateService.getOnPreview().subscribe(quote => {
      this.currentCompany = this.companiesStateService.getCurrentCompany();
      this.quoteCompany = this.companiesStateService.getCompanies().find(item => item.id === quote.company.id);
      this.open = true;
      this.quoteServices.getQuote(quote.id).subscribe((data) => {
        console.log("this.quoteCompany", this.quoteCompany);
        this.quote = new QuotePreview(data);
        this.open = true;
        this.showPreloader = false;
        console.log("this.quote", this.quote);
        console.log("this.currentCompany", this.currentCompany);
      })
    })
  }
  close() {
    this.open = false;
    this.showPreloader = true;

  }
  getTotalTaxes() {
    let totalTaxes = 0;
    totalTaxes += this.quote.services.reduce((a, b) => a + b.taxSum, 0);
    totalTaxes += this.quote.products.reduce((a, b) => a + b.taxSum, 0);
    return totalTaxes;
  }
  getSubTotalServices() {
    return this.quote.services.reduce((a, b) => a + b.sum, 0);
  }
  getSubTotalProducts() {
    return this.quote.products.reduce((a, b) => a + b.sum, 0);
  }
  public getDate(date) {
    return moment(new Date(date)).format('DD MMM YYYY');
  }
  getSelectedTaxes(taxes) {
    return taxes.map(item => {
      return `${item.name} ${item.rate}%`;
    }).join("<br>");
  }
  getCompanyLogoUrl() {
    if (this.currentCompany && this.currentCompany.logo && this.currentCompany.logo && this.currentCompany.logo.base64 && !this.currentCompany.logo.cropped) return this.currentCompany.logo.base64;
    if (this.currentCompany && this.currentCompany.logo && this.currentCompany.logo.cropped && this.currentCompany.logo.cropped.id) return `/file/${this.currentCompany.logo.cropped.id}`;
    if (this.currentCompany && this.currentCompany.logo && this.currentCompany.logo.origin && this.currentCompany.logo.origin.id) return `/file/${this.currentCompany.logo.origin.id}`;
    return '/company/default/logo.jpg';
  }
}
