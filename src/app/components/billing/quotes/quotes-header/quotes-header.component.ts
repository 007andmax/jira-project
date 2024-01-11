import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AppService } from 'src/app/states/app/app.service';
import { QuoteStateService } from 'src/app/states/quote/quote-state.service';
import { QuotesFilterComponent } from './quotes-filter/quotes-filter.component';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';
import { Quote } from '../class/quote';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ARCHIVE_QUOTES } from 'src/app/const/confirm';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';

@Component({
  selector: 'app-quotes-header',
  templateUrl: './quotes-header.component.html',
  styleUrls: ['./quotes-header.component.scss']
})
export class QuotesHeaderComponent implements OnInit {
  @ViewChild('filter', { static: true }) filter: QuotesFilterComponent;
  countFilter: number = 0;
  toggleFilter: boolean = false;
  @Input() selectAll: boolean = false;
  @Input() quotes: Array<Quote> = [];
  @Output() onCreatePayment = new EventEmitter<any>();
  @Output() onSelectAllQuotes = new EventEmitter<any>();
  @Output() onSortBy = new EventEmitter<any>();
  constructor(private quoteStateService: QuoteStateService,
    public customerPortalStateService: CustomerPortalStateService,
    private confirmStateService: ConfirmStateService,
    private modalService: NgbModal,
    public appService: AppService,) { }

  ngOnInit() {
  }
  getSelectedCount() {
    return this.quotes.filter(item => item.selected).length;
  }
  toggleAllQuotes(data) {
    this.selectAll = true;
    this.onSelectAllQuotes.emit(data);
  }
  delete() {
    this.confirmStateService.setConfirmAction(ARCHIVE_QUOTES);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.message = `Do you want to archive a quote?`;
    this.quoteStateService.setQuotesForArchive(this.quotes.filter(item => item.selected));
  }
  sortBy(data) {
    this.onSortBy.emit(data);
  }
  clearAll() {
    this.filter.onClearAll();
  }
  onChangeCountFilter(data) {
    this.countFilter = data;
  }
  onShowCreatePayment() {
    this.onCreatePayment.emit(null);
  }
  onShowCreateQuote() {
    this.quoteStateService.onInitAdd();
  }

}
