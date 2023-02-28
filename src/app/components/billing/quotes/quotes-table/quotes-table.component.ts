import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { TicketStateService } from 'src/app/components/tickets/tickets/ticket-edit-aside/services/ticket-state.service';
import { ARCHIVE_QUOTE } from 'src/app/const/confirm';
import { QUOTE_MODAL_ACTION_LIST } from 'src/app/const/quote';
import { ModalQuoteComponent } from 'src/app/services/modal/modal-quote/modal-quote.component';
import { QuoteService } from 'src/app/services/quote/quote.service';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { QuoteStateService } from 'src/app/states/quote/quote-state.service';
import { TicketsStateService } from 'src/app/states/tickets/tickets-state.service';
import { ToastrProgressStateService } from 'src/app/states/toastr-progress/toastr-progress-state.service';
import { ConfirmComponent } from '../../../shared/confirm/confirm.component';
import { ConfirmStateService } from '../../../shared/confirm/services/confirm-state.service';
import { Quote } from '../class/quote';
import { QuoteEdit } from '../class/quote-edit';
import { QuoteFilter } from '../class/quote-filter';
import { QuotePreview } from '../class/quote-preview';
import { QuoteSort } from '../class/quote-sort';
import { QuoteRealTimeService } from '../quote-realtime/quote-realtime.service';
import { QuotesListService } from './services/quotes-list.service';

@Component({
  selector: 'app-quotes-table',
  templateUrl: './quotes-table.component.html',
  styleUrls: ['./quotes-table.component.scss'],
  providers: [QuotesListService]
})
export class QuotesTableComponent implements OnInit, OnDestroy {
  filter: QuoteFilter = new QuoteFilter();
  sort: QuoteSort = new QuoteSort();
  quotes: Array<Quote> = [];
  showPendingPreloader: boolean = false;
  showPreloader: boolean = true;
  public page_number: number = 0;
  public infiniteScrollDisabled = true;
  sub: Subscription = new Subscription();
  container = document.body.querySelector(".main-container");
  constructor(private quotesListService: QuotesListService,
    private quoteRealTimeService: QuoteRealTimeService,
    public cd: ChangeDetectorRef,
    private modalService: NgbModal,
    private ticketsService: TicketsService,
    private ticketsStateService: TicketsStateService,
    private quoteStateService: QuoteStateService,
    private confirmStateService: ConfirmStateService,
    private toastrProgressStateService: ToastrProgressStateService,
    private companiesStateService: CompaniesStateService,
    private ticketStateService: TicketStateService,
    private quoteServices: QuoteService,) { }

  ngOnInit() {
    document.body.querySelector(".main-container").scrollTo(0, 0);
    this.onScroll();
    let getOnInitFilter = this.quoteStateService.getOnInitFilter().subscribe(data => {
      this.filter.setData(data);
      this.filter.clearSortBy();
      this.showPreloader = true;
      document.body.querySelector(".main-container").scrollTo(0, 0);
      this.setDefaultScoll();
      this.onScroll();
    })
    this.sub.add(getOnInitFilter);
    let changeQuotesArray = this.quoteRealTimeService.changeQuotesArray.subscribe((newChange) => {
      if (newChange.action === 'SALE_QUOTE_CREATED') {
        return this.quotes.unshift(newChange.data);
      } else {
        const elemIndex = this.quotes.findIndex((item) => item.id === newChange.data.id);
        if (!this.filter.isExistFilters() && (newChange.data.status === 'ARCHIVED' || newChange.data.status === 'TICKETED' || newChange.data.status === 'INVOICED' || newChange.data.status === 'BILLED')) {
          this.quotes.splice(elemIndex, 1);
        } else {
          this.quotes[elemIndex] = newChange.data;

        }
      }
    })
    this.sub.add(changeQuotesArray);
    let getHandleSendModeEdit = this.quoteStateService.getHandleSendModeList().subscribe(data => {
      let quote: QuoteEdit = data;
      this.quoteServices.editQuote(quote.getDataForUpdate(true)).subscribe((res) => {
        this.quoteServices.repeatSend(quote.id).subscribe(sendRes => {
        })
      });
    })
    this.sub.add(getHandleSendModeEdit);
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === ARCHIVE_QUOTE) this.onArchiveQuote();
      }
    })
    this.sub.add(getConfirm);
  }
  onInvoice(invoiceId) {
    this.quoteStateService.setInvoice(invoiceId);
  }
  public sortBy(value) {
    this.showPreloader = true;
    document.body.querySelector(".main-container").scrollTo(0, 0);
    this.setDefaultScoll();
    this.filter.sortBy = this.sort.getSortType(value);
    this.getQuotes()
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
  copy(item) {
    this.quoteServices.getQuote(item.id).subscribe((data) => {
      let quote = new QuotePreview(data)
      this.quoteStateService.setCopy(quote);
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
    if (item.status === 'TICKETED' || item.status === 'INVOICED' || item.status === 'BILLED') {
      this.quoteServices.repeatSend(item.id).subscribe();
    } else {
      let recipients = item.recipients;
      if (typeof recipients === "string") item.recipients = recipients.split(',');
      this.quoteServices.getQuote(item.id).subscribe((data) => {
        let quote: QuoteEdit = new QuoteEdit(data);
        const modalRef = this.modalService.open(ModalQuoteComponent, { windowClass: 'quote-send-modal', backdrop: 'static', keyboard: false });
        modalRef.componentInstance.data = quote;
        modalRef.componentInstance.action = QUOTE_MODAL_ACTION_LIST;
      })
    }
  }
  openTikcet(id) {
    if (this.companiesStateService.getCurrentCompany().id == ("73221c72-f87c-4519-8235-c4b57ad1cc19" || "72381bff-127c-4a63-9d2e-6e952350dcbd")) {
      this.ticketStateService.setTicketRoutingId(id);
      const url = `/#/${this.companiesStateService.getCurrentCompany().name.replaceAll(' ', '')}/ticket/${id}`;
      window.open(url, '_blank');
    } else {
      this.ticketsStateService.onOpenTicket();
      this.ticketsService.getTicket(id).subscribe(data => {
        this.ticketsStateService.onEditTicket(data);
      })
    }

  }
  goToQuoteEdit(quote) {
    this.quoteStateService.setEdit(quote);
  }
  onConvertToBillable(quote) {
    this.quoteServices.convertToBillable(quote.company, quote.id).subscribe((res) => {
      this.toastrProgressStateService.clear(quote.id);
    }, err => {
      this.toastrProgressStateService.clear(quote.id);
    });
  }
  onArchiveQuote() {
    let quote = this.quoteStateService.getQuoteForArchive();
    this.quoteServices.archiveQuote(quote.company, quote.id).subscribe((res) => {
    });
  }
  archiveQuote(item) {
    this.confirmStateService.setConfirmAction(ARCHIVE_QUOTE);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.message = `Do you want to archive a quote?`;
    this.quoteStateService.setQuoteForArchive(item);
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
      this.toastrProgressStateService.clear(item.id);
    }, err => {
      this.toastrProgressStateService.clear(item.id);
    });
  }
  convertToInvoice(item) {
    this.quoteServices.convertToInvoice({ companyInfo: item.company }, item.id).subscribe((res) => {
      this.toastrProgressStateService.clear(item.id);
    }, err => {
      this.toastrProgressStateService.clear(item.id);
    });
  }
  public trackById(index, item) {
    return item.id;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
