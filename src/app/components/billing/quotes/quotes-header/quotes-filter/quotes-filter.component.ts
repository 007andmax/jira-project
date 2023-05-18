import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { CompanySetting } from 'src/app/components/companies/class/company-setting';
import { CompanyDropDownComponent } from 'src/app/components/shared/company-drop-down/company-drop-down.component';
import { DropDownComponent } from 'src/app/components/shared/drop-down/drop-down.component';
import { MultiDatepickerComponent } from 'src/app/components/shared/multi-datepicker/multi-datepicker.component';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { QuoteStateService } from 'src/app/states/quote/quote-state.service';
import { QuoteFilter } from '../../class/quote-filter';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';

@Component({
  selector: 'app-quotes-filter',
  templateUrl: './quotes-filter.component.html',
  styleUrls: ['./quotes-filter.component.scss']
})
export class QuotesFilterComponent implements OnInit {
  @ViewChild('companyDp') companyDp: CompanyDropDownComponent;
  @ViewChild('statusDp') statusDp: DropDownComponent;
  @ViewChild('datesDp') datesDp: MultiDatepickerComponent;
  sub: Subscription = new Subscription();
  quotesFilter: QuoteFilter = new QuoteFilter();
  @Output() changeCountFilter = new EventEmitter<any>();
  statusTypes = [new CompanySetting('Approved', 'APPROVED'), new CompanySetting('Archived', 'ARCHIVED'),
  new CompanySetting('Expired', 'EXPIRED'), new CompanySetting('Invoiced', 'INVOICED'),
  new CompanySetting('Not Approved', 'NOT_APPROVED'), new CompanySetting('Read', 'READ'),
  new CompanySetting('Canceled', 'CANCELED'), new CompanySetting('Saved', 'SAVED'),
  new CompanySetting('Ticketed', 'TICKETED'), new CompanySetting('Unread', 'UNREAD'),
  new CompanySetting('Billed', 'BILLED')];
  constructor(private companiesState: CompaniesStateService,
    private customerPortalStateService: CustomerPortalStateService,
    private quoteStateService: QuoteStateService) { }

  ngOnInit() {
    if (this.customerPortalStateService.isCustomerPortal && this.companiesState.getCompanies().length > 0) this.checkCompanyCustomerUser();
    let getOnCompanies = this.companiesState.getOnCompanies().subscribe((data) => {
      if (this.customerPortalStateService.isCustomerPortal) this.checkCompanyCustomerUser();
    })
    this.sub.add(getOnCompanies);
  }
  private checkCompanyCustomerUser() {
    let selectedCompany = this.companiesState.getCompanies().find(item => item.id == localStorage.getItem('company_info_id'));
    this.companyDp.selectItemWithOutChanges(selectedCompany);
    this.companyDp.isDisabled = true;
  }
  onSelectStatus(status) {
    this.quotesFilter.setStatus((status) ? status.value : null);
    this.quoteStateService.onInitFilter(this.quotesFilter);
    this.onChangeCounterFilter();
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
