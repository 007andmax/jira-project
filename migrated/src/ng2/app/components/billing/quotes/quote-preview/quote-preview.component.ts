import { Component, OnInit } from '@angular/core';
import { QuoteStateService } from "../quote-create/quote-state.service";
import {UsersService} from "../../../../services/users/users.service";
import {CompaniesService} from "../../../../services/company/companies.service";

@Component({
  selector: 'app-quote-preview',
  templateUrl: './quote-preview.component.html',
  styleUrls: ['./quote-preview.component.scss']
})
export class QuotePreviewComponent implements OnInit {

  public quote: any;
  public company: any;
  public itemsArray = [];

  constructor(
    private quoteStateService: QuoteStateService,
    private companiesService: CompaniesService
  ) { }

  ngOnInit() {
    this.getQuoteInfo();
    this.getCurrentCompany();
    this.getItemsArray();
  }

  public getQuoteInfo() {
    this.quote = this.quoteStateService.getQuote();
  }

  public getCurrentCompany() {
    this.companiesService.getTechCompany().subscribe((res) => {
      console.log(res, 'ITEMS');
      return this.company = res;
    });
  }

  public getCLientUserName(companyInfo) {
    return `${companyInfo.contacts[0].firstName} ${companyInfo.contacts[0].lastName}`
  }

  public getCLientAddress(companyInfo) {
    return `${companyInfo.addresses[0].address}`
  }

  public getItemsArray() {
    this.itemsArray = this.quoteStateService.getItemArray();
    console.log(this.itemsArray, 'ITEMS');
  }

  public getPrice(cost, count, tax) {
    return this.roundToTwo(this.quoteStateService.getPrice(cost, count, tax));
  }

  public getTaxPrice(cost, count, tax) {
    return this.roundToTwo(this.quoteStateService.getTaxPrice(cost, count, tax));
  }

  public roundToTwo(num) {
    return parseFloat((Math.round(Number(num + 'e+2'))  + "e-2")).toFixed(2);
  }

}
