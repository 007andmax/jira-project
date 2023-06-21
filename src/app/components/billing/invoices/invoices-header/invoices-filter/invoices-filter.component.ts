import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { Subscription } from 'rxjs';
import { InvoicesFilter } from '../../class/invoices-filter';
import { InvoiceStateService } from 'src/app/states/invoice/invoice-state.service';
import { MultiDatepickerComponent } from 'src/app/components/shared/multi-datepicker/multi-datepicker.component';
import { CompanySetting } from 'src/app/components/companies/class/company-setting';
import { CompanyDropDownComponent } from 'src/app/components/shared/company-drop-down/company-drop-down.component';
import { DropDownComponent } from 'src/app/components/shared/drop-down/drop-down.component';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';

@Component({
  selector: 'app-invoices-filter',
  templateUrl: './invoices-filter.component.html',
  styleUrls: ['./invoices-filter.component.scss']
})
export class InvoicesFilterComponent implements OnInit {
  @ViewChild('companyDp') companyDp: CompanyDropDownComponent;
  @ViewChild('statusDp') statusDp: DropDownComponent;
  @ViewChild('datesDp') datesDp: MultiDatepickerComponent;
  sub: Subscription = new Subscription();
  invoicesFilter: InvoicesFilter = new InvoicesFilter();
  @Output() changeCountFilter = new EventEmitter<any>();
  statusTypes = [new CompanySetting('Paid invoices', 'PAID'), new CompanySetting('Unpaid invoices', 'UNPAID'), new CompanySetting('Overdue invoices', 'OVERDUE')];
  constructor(private companiesState: CompaniesStateService,
    private elRef: ElementRef,
    private customerPortalStateService: CustomerPortalStateService,
    private invoiceStateService: InvoiceStateService) { }

  ngOnInit() {
    if (this.customerPortalStateService.isCustomerPortal && this.companiesState.getCompanies().length > 0) this.checkCompanyCustomerUser();
    let getOnCompanies = this.companiesState.getOnCompanies().subscribe((data) => {
      if (this.customerPortalStateService.isCustomerPortal) this.checkCompanyCustomerUser();
    })
    this.sub.add(getOnCompanies);
    let onTicketFilters = this.customerPortalStateService.onInvoiceFilters.subscribe(data => (this.checkCompanyCustomerUser()));
    this.sub.add(onTicketFilters);
  }
  private checkCompanyCustomerUser() {
    this.invoicesFilter = this.customerPortalStateService.getInvoicesFilter();
    let selectedCompany = this.companiesState.getCompanies().find(item => item.id == localStorage.getItem('company_info_id'));
    this.companyDp.selectItemWithOutChanges(selectedCompany);
    this.companyDp.isDisabled = true;
  }
  onSelectStatus(status) {
    this.invoicesFilter.setStatus((status) ? status.value : null);
    this.invoiceStateService.onInitFilter(this.invoicesFilter);
    this.onChangeCounterFilter();
  }
  public onClearAll() {
    if (!this.customerPortalStateService.isCustomerPortal) this.companyDp.clearWithOutChanges();
    this.datesDp.clearWithOutChanges();
    this.statusDp.clearWithOutChanges();
    this.invoicesFilter.setStatus(null);
    if (!this.customerPortalStateService.isCustomerPortal) this.invoicesFilter.setCompanyId(null);
    this.invoicesFilter.setStartDate(null);
    this.invoicesFilter.setEndDate(null);
    this.invoicesFilter.setInvoiceNumber(null);
    this.invoicesFilter.setAmount(null);
    this.elRef.nativeElement.querySelector("#amount-filter").value = "";
    this.invoiceStateService.onInitFilter(this.invoicesFilter);
    this.onChangeCounterFilter();
  }

  public onSelectCompany(item) {
    if (!item) {
      this.invoicesFilter.setCompanyId(null);
    } else {
      this.invoicesFilter.setCompanyId(item.id);
    }
    this.invoiceStateService.onInitFilter(this.invoicesFilter);
    this.onChangeCounterFilter();
  }
  public onSetAmountInvoice(event) {
    this.invoicesFilter.setAmount((event.target.value.length > 0) ? parseFloat(event.target.value).toFixed(2) : null);
    if (event.target.value.length > 0) this.elRef.nativeElement.querySelector("#amount-filter").value = this.invoicesFilter.amount;
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
    if (this.invoicesFilter.companyId) count++;
    if (this.invoicesFilter.endDate && this.invoicesFilter.startDate) count++;
    if (this.invoicesFilter.invoiceNumber) count++;
    if (this.invoicesFilter.status) count++;
    if (this.invoicesFilter.amount) count++;
    this.changeCountFilter.emit(count);
  }
}
