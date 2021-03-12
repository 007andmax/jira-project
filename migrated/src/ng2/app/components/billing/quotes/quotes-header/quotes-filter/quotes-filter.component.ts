import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { CompanySetting } from 'src/ng2/app/components/companies/class/company-setting';
import { MultiDatepickerComponent } from 'src/ng2/app/components/shared/multi-datepicker/multi-datepicker.component';
import { SelectSearchComponent } from 'src/ng2/app/components/shared/select-search/select-search.component';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { QuoteStateService } from 'src/ng2/app/states/quote/quote-state.service';
import { QuoteFilter } from '../../class/quote-filter';

@Component({
  selector: 'app-quotes-filter',
  templateUrl: './quotes-filter.component.html',
  styleUrls: ['./quotes-filter.component.scss']
})
export class QuotesFilterComponent implements OnInit {
  companies = [];
  @ViewChild('companyDp') companyDp: SelectSearchComponent;
  @ViewChild('statusDp') statusDp: SelectSearchComponent;
  @ViewChild('datesDp') datesDp: MultiDatepickerComponent;
  sub: Subscription = new Subscription();
  quotesFilter: QuoteFilter = new QuoteFilter();
  @Output() changeCountFilter = new EventEmitter<any>();
  statusTypes = [new CompanySetting('Approved', 'APPROVED'), new CompanySetting('Archived', 'ARCHIVED'),
  new CompanySetting('Expired', 'EXPIRED'), new CompanySetting('Invoiced', 'INVOICED'),
  new CompanySetting('Not Approved', 'NOT_APPROVED'), new CompanySetting('Read', 'READ'),
  new CompanySetting('Canceled', 'CANCELED'), new CompanySetting('Saved', 'SAVED'),
  new CompanySetting('Ticketed', 'TICKETED'), new CompanySetting('Unread', 'UNREAD'),];
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
    console.log("event.target.value", event.target.value);
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
