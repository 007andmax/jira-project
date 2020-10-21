import { Component, OnInit } from '@angular/core';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { QuotePreview } from '../class/quote-preview';
import { QuoteStateService } from '../quote-create/quote-state.service';
import * as moment from "moment";

@Component({
  selector: 'app-quote-aside-preview',
  templateUrl: './quote-aside-preview.component.html',
  styleUrls: ['./quote-aside-preview.component.scss']
})
export class QuoteAsidePreviewComponent implements OnInit {
  quote: QuotePreview;
  showPreloader: boolean = true;
  currentCompany: any;

  open: boolean = false;
  constructor(private quoteStateService: QuoteStateService,
    private companiesStateService: CompaniesStateService) { }

  ngOnInit() {
    this.currentCompany = this.companiesStateService.getCurrentCompany();
    this.quoteStateService.getOnPreview().subscribe(data => {
      this.quote = data;
      this.open = true;
      this.showPreloader = false;
    })
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
