import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { QuoteStateService } from "../quote-create/quote-state.service";
import { CompaniesService } from "../../../../services/company/companies.service";
import { DateService } from "../../../../services/date/date.service";
import { QuoteCreateContentComponent } from "../quote-create/quote-create-content/quote-create-content.component";
import {QuoteService} from "../../../../services/quote/quote.service";

@Component({
  selector: 'app-quote-preview',
  templateUrl: './quote-preview.component.html',
  styleUrls: ['./quote-preview.component.scss']
})
export class QuotePreviewComponent implements OnInit {

  public quote: any;
  public quoteForCreate: any;
  public company: any;
  public itemsArray = [];
  public editable: any;
  @Output() saveAndContinue = new EventEmitter<string>();
  public stopCache = Math.floor(Math.random() * 100000);
  @ViewChild(QuoteCreateContentComponent) quoteCreateContentComponent:QuoteCreateContentComponent;

  constructor(
    private quoteStateService: QuoteStateService,
    private companiesService: CompaniesService,
    private dateService: DateService,
    private quoteService: QuoteService
  ) { }

  ngOnInit() {
    this.getQuoteInfo();
    this.getCurrentCompany();
    this.getItemsArray();
    this.editable = this.quoteStateService.getState().params.editable;
    console.log(this.editable, 'editable');
  }

  public getQuoteInfo() {
    this.quote = this.quoteStateService.getQuote();
    this.quoteForCreate = this.quoteStateService.getQuoteCreate();
  }

  public getCurrentCompany() {
    this.companiesService.getTechCompany().subscribe((res) => {
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

  public getFormatDate(date) {
    if (date) {
      date = `${date.year}/${date.month}/${date.day}`;
      return this.dateService.getInvoiceDate(date);
    } else {
      return ''
    }
  }

  public getGlobalNote() {
    if (this.quoteForCreate.globalNote.hasOwnProperty('line1')) {
      return this.quoteForCreate.globalNote.line1
    } else {
      return this.quoteForCreate.globalNote
    }
  }

  goToCreate() {
    this.quoteStateService.goToState('quote-create-component', { editMode: true});
  }

  /**
   * Create quote and save
   */
  public save() {
    this.quoteService.createQuote({
      client: this.quote.client,
      startDate: this.quoteForCreate.endDate,
      endDate: this.quoteForCreate.startDate,
      globalNote: this.quoteForCreate.globalNote,
      regularNote: this.quoteForCreate.selectedNote
    }, false).subscribe();
  }

  /**
   * Return to quotes
   */
  public goToQuotes() {
    this.quoteStateService.goToState('quotes-component');
  }

}
