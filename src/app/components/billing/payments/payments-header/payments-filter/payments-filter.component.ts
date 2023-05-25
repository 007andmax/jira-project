import { Component, OnInit, ViewChild, Output, EventEmitter, ElementRef } from '@angular/core';
import { PaymentsFilter } from '../../class/payments-filter';
import { PaymentsStateService } from 'src/app/states/payments/payments-state.service';
import { MultiDatepickerComponent } from 'src/app/components/shared/multi-datepicker/multi-datepicker.component';
import { Subscription } from 'rxjs';
import { CompanySetting } from 'src/app/components/companies/class/company-setting';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { CompanyDropDownComponent } from 'src/app/components/shared/company-drop-down/company-drop-down.component';
import { DropDownComponent } from 'src/app/components/shared/drop-down/drop-down.component';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';

@Component({
  selector: 'app-payments-filter',
  templateUrl: './payments-filter.component.html',
  styleUrls: ['./payments-filter.component.scss']
})
export class PaymentsFilterComponent implements OnInit {
  @ViewChild('companyDp') companyDp: CompanyDropDownComponent;
  @ViewChild('statusDp') statusDp: DropDownComponent;
  @ViewChild('datesDp') datesDp: MultiDatepickerComponent;
  sub: Subscription = new Subscription();
  paymentsFilter: PaymentsFilter = new PaymentsFilter();
  @Output() changeCountFilter = new EventEmitter<any>();
  statusTypes = [new CompanySetting('Paid', 'PAID'), new CompanySetting('Refund', 'REFUND')];
  constructor(private companiesState: CompaniesStateService,
    private elRef: ElementRef,
    private customerPortalStateService: CustomerPortalStateService,
    private paymentsStateService: PaymentsStateService) { }

  ngOnInit() {
    if (this.customerPortalStateService.isCustomerPortal && this.companiesState.getCompanies().length > 0) this.checkCompanyCustomerUser();
    let getOnCompanies = this.companiesState.getOnCompanies().subscribe((data) => {
      if (this.customerPortalStateService.isCustomerPortal) this.checkCompanyCustomerUser();
    })
    this.sub.add(getOnCompanies);
    let onPaymentsFilters = this.customerPortalStateService.onPaymentsFilters.subscribe(data => (this.checkCompanyCustomerUser()));
    this.sub.add(onPaymentsFilters);
  }
  private checkCompanyCustomerUser() {
    this.paymentsFilter = this.customerPortalStateService.getPaymentsFilter();
    let selectedCompany = this.companiesState.getCompanies().find(item => item.id == localStorage.getItem('company_info_id'));
    this.companyDp.selectItemWithOutChanges(selectedCompany);
    this.companyDp.isDisabled = true;
  }
  onSelectStatus(status) {
    this.paymentsFilter.setStatus((status) ? status.value : null);
    this.paymentsStateService.onInitFilter(this.paymentsFilter);
    this.onChangeCounterFilter();
  }
  public onClearAll() {
    this.companyDp.clearWithOutChanges();
    this.datesDp.clearWithOutChanges();
    this.statusDp.clearWithOutChanges();
    this.paymentsFilter.setStatus(null);
    this.paymentsFilter.setAmount(null);
    this.paymentsFilter.setCompany(null);
    this.paymentsFilter.setStartDate(null);
    this.paymentsFilter.setEndDate(null);
    this.paymentsFilter.setInvoiceNumber(null);

    this.paymentsStateService.onInitFilter(this.paymentsFilter);
    this.onChangeCounterFilter();
    this.elRef.nativeElement.querySelector("#amount-filter").value = "";
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
    if (this.paymentsFilter.amount) count++;
    this.changeCountFilter.emit(count);
  }
  public onSetAmountInvoice(event) {
    this.paymentsFilter.setAmount((event.target.value.length > 0) ? parseFloat(event.target.value).toFixed(2) : null);
    if (event.target.value.length > 0) this.elRef.nativeElement.querySelector("#amount-filter").value = this.paymentsFilter.amount;
    this.paymentsStateService.onInitFilter(this.paymentsFilter);
    this.onChangeCounterFilter();
  }
}
