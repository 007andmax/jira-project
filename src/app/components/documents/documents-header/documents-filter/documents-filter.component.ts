import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { QuoteFilter } from 'src/app/components/billing/quotes/class/quote-filter';
import { MultiDatepickerComponent } from 'src/app/components/shared/multi-datepicker/multi-datepicker.component';
import { SelectSearchComponent } from 'src/app/components/shared/select-search/select-search.component';
import { FORMAT_DATE_2 } from 'src/app/const/date-picker';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { QuoteStateService } from 'src/app/states/quote/quote-state.service';

@Component({
  selector: 'documents-filter',
  templateUrl: './documents-filter.component.html',
  styleUrls: ['./documents-filter.component.scss']
})
export class DocumentsFilterComponent implements OnInit {
  formatDate: string = FORMAT_DATE_2;
  companies = [];
  defaultDate: number = new Date().getTime();
  @ViewChild('companyDp') companyDp: SelectSearchComponent;
  @ViewChild('statusDp') statusDp: SelectSearchComponent;
  @ViewChild('datesDp') datesDp: MultiDatepickerComponent;
  sub: Subscription = new Subscription();
  quotesFilter: QuoteFilter = new QuoteFilter();
  @Output() changeCountFilter = new EventEmitter<any>();

  constructor(private companiesState: CompaniesStateService,
    private quoteStateService: QuoteStateService) { }

  ngOnInit() {
    if (this.companiesState.getCompanies().length > 0) this.getClientsList(this.companiesState.getCompanies());
    let getOnCompanies = this.companiesState.getOnCompanies().subscribe((data) => {
      this.getClientsList(data);
    })
    this.sub.add(getOnCompanies);
  }
  onSelectStatus(status) {
    this.quotesFilter.setStatus((status) ? status.value : null);
    this.quoteStateService.onInitFilter(this.quotesFilter);
    this.onChangeCounterFilter();
  }
  private getClientsList(data) {
    this.companies = data.filter(item => item.accountType === 'CLIENT' && !item.deletedAt).sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
      1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
  }
  public onClearAll() {
    this.companyDp.clearWithOutChanges();
    this.datesDp.clearWithOutChanges();
    this.statusDp.clearWithOutChanges();
    this.quotesFilter.setStatus(null);
    this.quotesFilter.setCompanyName(null);
    this.quotesFilter.setStartDate(null);
    this.quotesFilter.setEndDate(null);
    this.quotesFilter.setQuoteNumber(null);
    this.quoteStateService.onInitFilter(this.quotesFilter);
    this.onChangeCounterFilter();
  }
  public onSelectCompany(item) {
    if (!item) {
      this.quotesFilter.setCompanyName(null);
    } else {
      this.quotesFilter.setCompanyName(item.name);
    }
    this.quoteStateService.onInitFilter(this.quotesFilter);
    this.onChangeCounterFilter();
  }
  public onSetNumberQuote(event) {
    this.quotesFilter.setQuoteNumber((event.target.value.length > 0) ? event.target.value : null);
    this.quoteStateService.onInitFilter(this.quotesFilter);
    this.onChangeCounterFilter();
  }
  public filterByDate(value) {
    if (value.start !== '' && value.end !== '') {
      this.quotesFilter.setStartDate(new Date(value.start).getTime());
      this.quotesFilter.setEndDate(new Date(value.end).getTime());
    } else {
      this.quotesFilter.setStartDate(null);
      this.quotesFilter.setEndDate(null);
    }
    this.quoteStateService.onInitFilter(this.quotesFilter);
    this.onChangeCounterFilter();
  }
  public onChangeCounterFilter() {
    let count = 0;
    if (this.quotesFilter.companyName) count++;
    if (this.quotesFilter.endDate && this.quotesFilter.date) count++;
    if (this.quotesFilter.quoteNumber) count++;
    if (this.quotesFilter.status) count++;
    this.changeCountFilter.emit(count);
  }

}
