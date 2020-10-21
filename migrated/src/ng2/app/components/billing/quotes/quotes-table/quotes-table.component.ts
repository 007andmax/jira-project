import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { ModalQuoteComponent } from 'src/ng2/app/services/modal/modal-quote/modal-quote.component';
import { QuoteService } from 'src/ng2/app/services/quote/quote.service';
import { Quote } from '../class/quote';
import { QuoteFilter } from '../class/quote-filter';
import { QuotePreview } from '../class/quote-preview';
import { QuoteStateService } from '../quote-create/quote-state.service';
import { QuotesListService } from './services/quotes-list.service';

@Component({
  selector: 'app-quotes-table',
  templateUrl: './quotes-table.component.html',
  styleUrls: ['./quotes-table.component.scss'],
  providers: [QuotesListService]
})
export class QuotesTableComponent implements OnInit {
  filter: QuoteFilter = new QuoteFilter();
  quotes: Array<Quote> = [];
  showPendingPreloader: boolean = false;
  showPreloader: boolean = true;
  public page_number: number = 0;
  public infiniteScrollDisabled = true;
  sub: Subscription = new Subscription();
  constructor(private quotesListService: QuotesListService,
     
    public cd: ChangeDetectorRef,
    private modalService: NgbModal,
    private quoteStateService: QuoteStateService,
    private quoteServices: QuoteService,) { }

  ngOnInit() {
    console.log("QuotesTableComponent");
    window.scrollTo(0, 0);
    this.onScroll();
    let getOnInitFilter = this.quoteStateService.getOnInitFilter().subscribe(data => {
    //  this.selectedPayments = [];
    //  this.selectedCompanyId = null;
      this.filter = data;
      this.showPreloader = true;
      window.scrollTo(0, 0);
      this.setDefaultScoll();
      this.onScroll();
    })
    this.sub.add(getOnInitFilter);
  }
  public setDefaultScoll() {
    this.page_number = 0;
    this.quotesListService.setBlockList(false);
    this.quotes = [];
  }
  getQuotes() {
    if (this.quotesListService.getBlockList()) {
      this.infiniteScrollDisabled = false;
      return;
    }
    this.filter.setOffset(this.page_number * this.filter.limit);
    if (this.page_number > 0) this.showPendingPreloader = true;
    this.quoteServices.getQuotes(this.filter.getFIlter()).subscribe((data: any) => {
      this.quotes = [...this.quotes, ...data];
      this.infiniteScrollDisabled = false;
      if (data.length < this.filter.limit) this.quotesListService.setBlockList(true);
      this.page_number += 1;
      this.showPreloader = false;
      this.showPendingPreloader = false;
      this.cd.detectChanges();
    })
  }
  preview(item) {
   
      this.quoteStateService.setPreview(item);
    
  }
  public onScroll() {
    this.infiniteScrollDisabled = true;
    this.getQuotes();
  }
  downloadPdf(item) {
    this.quoteServices.downloadPdf(item.id).subscribe((res) => this.quoteServices.downLoadFile(res, item.id, item.company.name, item.quoteNumber));
  }
  public resend(item) {
    if (item.status === 'TICKETED' || item.status === 'INVOICED') {
      this.quoteServices.repeatSend(item.id).subscribe();
    } else {
      let recipients = item.recipients;
      if (typeof recipients === "string") item.recipients = recipients.split(',');
      this.quoteServices.getQuote(item.id).subscribe((data) => {
        const modalRef = this.modalService.open(ModalQuoteComponent, data);
        modalRef.componentInstance.data = data;
      })

    }

  }
  goToQuoteEdit(quote) {
    this.quoteServices.getQuote(quote.id).subscribe((data) => {
      this.quoteStateService.setEditQuote(data);
    })

  }
  archiveQuote(item) {
    this.quoteServices.archiveQuote(item.company, item.id).subscribe((res) => {

    });
  }
  cancelQuote(item) {
    this.quoteServices.cancelQuote(item.company, item.id).subscribe((res) => {

    });
  }
  markAsRead(item) {
    this.quoteServices.markAsRead(item.company, item.id).subscribe((res) => {

    });
  }
  approveQuote(item) {
    this.quoteServices.approveQuote(item.company, item.id).subscribe((res) => {

    });
  }
  convertToTicket(item) {
    this.quoteServices.convertToTicket(item.company, item.id).subscribe((res) => {

    });
  }
  convertToInvoice(item) {
    this.quoteServices.convertToInvoice({ companyInfo: item.company }, item.id).subscribe((res) => {

    });
  }
}
