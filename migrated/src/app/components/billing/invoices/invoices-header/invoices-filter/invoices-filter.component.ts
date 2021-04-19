import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { Subscription } from 'rxjs';
import { InvoicesFilter } from '../../class/invoices-filter';
import { InvoiceStateService } from 'src/app/states/invoice/invoice-state.service';
import { SelectSearchComponent } from 'src/app/components/shared/select-search/select-search.component';
import { MultiDatepickerComponent } from 'src/app/components/shared/multi-datepicker/multi-datepicker.component';
import { CompanySetting } from 'src/app/components/companies/class/company-setting';

@Component({
  selector: 'app-invoices-filter',
  templateUrl: './invoices-filter.component.html',
  styleUrls: ['./invoices-filter.component.scss']
})
export class InvoicesFilterComponent implements OnInit {
  companies = [];
  @ViewChild('companyDp') companyDp: SelectSearchComponent;
  @ViewChild('statusDp') statusDp: SelectSearchComponent;
  @ViewChild('datesDp') datesDp: MultiDatepickerComponent;
  sub: Subscription = new Subscription();
  invoicesFilter: InvoicesFilter = new InvoicesFilter();
  @Output() changeCountFilter = new EventEmitter<any>();
  statusTypes = [new CompanySetting('Paid invoices', 'PAID'), new CompanySetting('Unpaid invoices', 'UNPAID'), new CompanySetting('Overdue invoices', 'OVERDUE')];
  constructor(private companiesState: CompaniesStateService,
    private invoiceStateService: InvoiceStateService) { }

  ngOnInit() {
    if (this.companiesState.getCompanies().length > 0) this.getClientsList(this.companiesState.getCompanies());
    let getOnCompanies = this.companiesState.getOnCompanies().subscribe((data) => {
      this.getClientsList(data);
    })
    this.sub.add(getOnCompanies);
  }
  onSelectStatus(status) {
    this.invoicesFilter.setStatus((status) ? status.value : null);
    this.invoiceStateService.onInitFilter(this.invoicesFilter);
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
    this.invoicesFilter.setStatus(null);
    this.invoicesFilter.setCompany(null);
    this.invoicesFilter.setStartDate(null);
    this.invoicesFilter.setEndDate(null);
    this.invoicesFilter.setInvoiceNumber(null);

    this.invoiceStateService.onInitFilter(this.invoicesFilter);
    this.onChangeCounterFilter();
  }

  public onSelectCompany(item) {
    if (!item) {
      this.invoicesFilter.setCompany(null);
    } else {
      this.invoicesFilter.setCompany(item.name);
    }
    this.invoiceStateService.onInitFilter(this.invoicesFilter);
    this.onChangeCounterFilter();
  }
  public onSetNumberInvoice(event) {
    this.invoicesFilter.setInvoiceNumber((event.target.value.length > 0) ? event.target.value : null);
    this.invoiceStateService.onInitFilter(this.invoicesFilter);
    this.onChangeCounterFilter();
  }
  public filterByDate(value) {
    if (value.start !== '' && value.end !== '') {
      this.invoicesFilter.setStartDate(new Date(value.start).getTime());
      this.invoicesFilter.setEndDate(new Date(value.end).getTime());
    } else {
      this.invoicesFilter.setStartDate(null);
      this.invoicesFilter.setEndDate(null);
    }
    this.invoiceStateService.onInitFilter(this.invoicesFilter);
    this.onChangeCounterFilter();
  }
  public onChangeCounterFilter() {
    let count = 0;
    if (this.invoicesFilter.companyName) count++;
    if (this.invoicesFilter.endDate && this.invoicesFilter.startDate) count++;
    if (this.invoicesFilter.invoiceNumber) count++;
    if (this.invoicesFilter.status) count++;
    this.changeCountFilter.emit(count);
  }
}
