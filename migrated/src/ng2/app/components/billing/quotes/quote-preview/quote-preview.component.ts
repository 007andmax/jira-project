import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { QuoteStateService } from "../quote-create/quote-state.service";
import { CompaniesService } from "../../../../services/company/companies.service";
import { DateService } from "../../../../services/date/date.service";
import { QuoteCreateContentComponent } from "../quote-create/quote-create-content/quote-create-content.component";
import {QuoteService} from "../../../../services/quote/quote.service";
import {takeUntil} from "rxjs/operators";
import {Subject} from "rxjs";
import {environment} from "../../../../../environments/environment";
import {ModalQuoteComponent} from "../../../../services/modal/modal-quote/modal-quote.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

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
  private apiUrl = environment.apiUrl;
  @Output() saveAndContinue = new EventEmitter<string>();
  public stopCache = Math.floor(Math.random() * 100000);
  private unsubscribe: Subject<void> = new Subject();
  @ViewChild(QuoteCreateContentComponent) quoteCreateContentComponent:QuoteCreateContentComponent;

  constructor(
    private quoteStateService: QuoteStateService,
    private companiesService: CompaniesService,
    private dateService: DateService,
    private quoteService: QuoteService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.getQuoteInfo();
    this.getCurrentCompany();
    this.getItemsArray();
    this.editable = this.quoteStateService.getState().params.editable;
    this.handeSendMode();
  }

  public getQuoteInfo() {
    this.quote = this.quoteStateService.getQuote();
    console.log(this.quote, '123512');
    this.quoteForCreate = this.quoteStateService.getQuoteCreate();
    console.log(this.quoteForCreate, '123512');
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
   * Create quote and approve
   */
  public approveQuote() {
    this.quoteService.createQuote({
      client: this.quote.client,
      startDate: this.quoteForCreate.endDate,
      endDate: this.quoteForCreate.startDate,
      globalNote: this.quoteForCreate.globalNote,
      regularNote: this.quoteForCreate.selectedNote
    }, false)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((res) => {
        this.quoteService.approveQuote(res['company'], res['id'])
          .pipe(takeUntil(this.unsubscribe))
          .subscribe((res) => {
            this.quoteStateService.goToQuote();
          });
      });
  }

  /**
   * Create quote and approve
   */
  public downloadPdf() {
    this.quoteService.createQuote({
      client: this.quote.client,
      startDate: this.quoteForCreate.endDate,
      endDate: this.quoteForCreate.startDate,
      globalNote: this.quoteForCreate.globalNote,
      regularNote: this.quoteForCreate.selectedNote
    }, false)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((res) => {
        const id = res['id'];
        this.quoteService.downloadPdf(res['id']).subscribe((res) => this.downLoadFile(res,id));
      });
  }

  /**
   * save quote and open send modal
   */
  public saveAndSend() {
    this.modalService.open(ModalQuoteComponent);
  }

  /**
   * Method is use to download file.
   * @param res - Array Buffer data
   * @param id - type of the document.
   */
  downLoadFile(res: any, id) {
    const data = window.URL.createObjectURL(res);
    var link = document.createElement('a');
    link.href = data;
    link.download=`${this.apiUrl}saleQuotes/${id}/pdf.pdf`;
    link.click();
    this.quoteStateService.goToQuote();
  }

  /**
   * Return to quotes
   */
  public goToQuotes() {
    this.quoteStateService.goToState('quotes-component');
  }

  public handeSendMode() {
    this.quoteStateService.handeSendMode
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((res) => {
        this.saveAndContinueMode(true);
      })
  }

  /**
   * Create quote
   */
  saveAndContinueMode(notification?: boolean) {
    console.log(this.quoteForCreate, 'quoteForCreate');
    const isFormReady = this.quoteStateService.getType();
    const currentQuote = this.quoteStateService.getQuoteCreate();
    if (notification) {
      this.quoteService.createQuote(this.quoteForCreate, true)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((res) => {
          this.quoteStateService.goToQuote();
        })
    } else {
      this.quoteService.createQuote(this.quoteForCreate, false)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((res) => {
          this.quoteStateService.goToQuote();
        })
    }
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
