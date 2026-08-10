import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { AppService } from 'src/app/states/app/app.service';
import { QuoteStateService } from 'src/app/states/quote/quote-state.service';
import { QuotesFilterComponent } from './quotes-filter/quotes-filter.component';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';
import { Quote } from '../class/quote';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ARCHIVE_QUOTES } from 'src/app/const/confirm';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';
import { TicketSortBy } from 'src/app/components/tickets/tickets/class/ticket-sort-by';
import { QuoteFilter } from '../class/quote-filter';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-quotes-header',
  templateUrl: './quotes-header.component.html',
  styleUrls: ['./quotes-header.component.scss']
})
export class QuotesHeaderComponent implements OnInit, OnDestroy {
  countFilter: number = 0;
  toggleFilter: boolean = false;
  @Input() selectAll: boolean = false;
  @Input() quotes: Array<Quote> = [];
  @Output() onCreatePayment = new EventEmitter<any>();
  @Output() onSelectAllQuotes = new EventEmitter<any>();
  @Output() onSortBy = new EventEmitter<any>();
  filter: QuoteFilter = new QuoteFilter();
  sub: Subscription = new Subscription();
  constructor(private quoteStateService: QuoteStateService,
    public customerPortalStateService: CustomerPortalStateService,
    private confirmStateService: ConfirmStateService,
    private modalService: NgbModal,
    public appService: AppService,) { }


  ngOnInit() {
    let onCloseFitler = this.quoteStateService.onToggleFitler.subscribe(res => {
      this.toggleFilter = res;
    })
    this.sub.add(onCloseFitler);
    let getFilter = this.quoteStateService.getOnInitFilter().subscribe(data => {
      this.filter.setData(data)
      this.onChangeCounterFilter();
    })
    this.sub.add(getFilter);
  }
  getSelectedCount() {
    return this.quotes.filter(item => item.selected).length;
  }
  public onChangeCounterFilter() {
    this.countFilter = 0;
    if (this.filter.companyId) this.countFilter++;
    if (this.filter.endDate && this.filter.date) this.countFilter++;
    if (this.filter.quoteNumber) this.countFilter++;
    if (this.filter.status) this.countFilter++;
  }
  delete() {
    this.confirmStateService.setConfirmAction(ARCHIVE_QUOTES);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.header = 'Archive Quote';
    modalRef.componentInstance.message = `Are you sure you want to archive a quote?`;
    this.quoteStateService.setQuotesForArchive(this.quotes.filter(item => item.selected));
  }
  getTextCountFilters() {
    return `Filters${(this.countFilter > 0) ? ' (' + this.countFilter + ')' : ''}`;
  }
  public onToggleFilters(data) {
    this.toggleFilter = data;
    this.quoteStateService.onToggleFitler.emit(data);
  }
  onChangeCountFilter(data) {
    this.countFilter = data;
  }
  onShowCreatePayment() {
    this.onCreatePayment.emit(null);
  }
  clearAll() {
    this.quoteStateService.onClearFitler.emit(null);
  }
  onShowCreateQuote() {
    this.quoteStateService.onInitAdd();
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
