import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { PaymentsFilter } from '../../class/payments-filter';
import { PaymentsStateService } from 'src/app/states/payments/payments-state.service';
import { SelectSearchComponent } from 'src/app/components/shared/select-search/select-search.component';
import { MultiDatepickerComponent } from 'src/app/components/shared/multi-datepicker/multi-datepicker.component';
import { Subscription } from 'rxjs';
import { CompanySetting } from 'src/app/components/companies/class/company-setting';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';

@Component({
  selector: 'app-payments-filter',
  templateUrl: './payments-filter.component.html',
  styleUrls: ['./payments-filter.component.scss']
})
export class PaymentsFilterComponent implements OnInit {

  companies = [];
  @ViewChild('companyDp') companyDp: SelectSearchComponent;
  @ViewChild('statusDp') statusDp: SelectSearchComponent;
  @ViewChild('datesDp') datesDp: MultiDatepickerComponent;
  sub: Subscription = new Subscription();
  paymentsFilter: PaymentsFilter = new PaymentsFilter();
  @Output() changeCountFilter = new EventEmitter<any>();
  statusTypes = [new CompanySetting('Paid', 'PAID'), new CompanySetting('Refund', 'REFUND')];
  constructor(private companiesState: CompaniesStateService,
    private paymentsStateService: PaymentsStateService) { }

  ngOnInit() {
    if (this.companiesState.getCompanies().length > 0) this.getClientsList(this.companiesState.getCompanies());
    let getOnCompanies = this.companiesState.getOnCompanies().subscribe((data) => {
      this.getClientsList(data);
    })
    this.sub.add(getOnCompanies);
  }
  onSelectStatus(status) {
    this.paymentsFilter.setStatus((status) ? status.value : null);
    this.paymentsStateService.onInitFilter(this.paymentsFilter);
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
    this.paymentsFilter.setStatus(null);
    this.paymentsFilter.setCompany(null);
    this.paymentsFilter.setStartDate(null);
    this.paymentsFilter.setEndDate(null);
    this.paymentsFilter.setInvoiceNumber(null);

    this.paymentsStateService.onInitFilter(this.paymentsFilter);
    this.onChangeCounterFilter();
  }

  public onSelectCompany(item) {
    if (!item) {
      this.paymentsFilter.setCompany(null);
    } else {
      this.paymentsFilter.setCompany(item.name);
    }
    this.paymentsStateService.onInitFilter(this.paymentsFilter);
    this.onChangeCounterFilter();
  }
  public onSetNumberInvoice(event) {
    this.paymentsFilter.setInvoiceNumber((event.target.value.length > 0) ? event.target.value : null);
    this.paymentsStateService.onInitFilter(this.paymentsFilter);
    this.onChangeCounterFilter();
  }
  public filterByDate(value) {
    if (value.start !== '' && value.end !== '') {
      this.paymentsFilter.setStartDate(new Date(value.start).getTime());
      this.paymentsFilter.setEndDate(new Date(value.end).getTime());
    } else {
      this.paymentsFilter.setStartDate(null);
      this.paymentsFilter.setEndDate(null);
    }
    this.paymentsStateService.onInitFilter(this.paymentsFilter);
    this.onChangeCounterFilter();
  }
  public onChangeCounterFilter() {
    let count = 0;
    if (this.paymentsFilter.companyName) count++;
    if (this.paymentsFilter.endDate && this.paymentsFilter.startDate) count++;
    if (this.paymentsFilter.invoiceNumber) count++;
    if (this.paymentsFilter.status) count++;
    this.changeCountFilter.emit(count);
  }

}
