import { Component, OnInit, ViewChild, Output, EventEmitter, ElementRef, OnDestroy } from '@angular/core';
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
export class PaymentsFilterComponent implements OnInit, OnDestroy {
  @ViewChild('companyDp', { static: true }) companyDp: CompanyDropDownComponent;
  @ViewChild('statusDp', { static: true }) statusDp: DropDownComponent;
  @ViewChild('datesDp', { static: true }) datesDp: MultiDatepickerComponent;
  sub: Subscription = new Subscription();
  paymentsFilter: PaymentsFilter = new PaymentsFilter();
  @Output() changeCountFilter = new EventEmitter<any>();
  statusTypes = [new CompanySetting('Payment Completed', 'PAYMENT_COMPLETED'), new CompanySetting('Refund Failed', 'REFUND_FAILED'),
  new CompanySetting('Payment Requested', 'PAYMENT_REQUESTED'),
  new CompanySetting('Payment Failed', 'PAYMENT_FAILED'),
  new CompanySetting('Refund Requested', 'REFUND_REQUESTED'),
  new CompanySetting('Refund Payment', 'REFUND_PAYMENT')
  ];
  constructor(private companiesState: CompaniesStateService,
    private elRef: ElementRef,
    private customerPortalStateService: CustomerPortalStateService,
    private paymentsStateService: PaymentsStateService) { }

  ngOnInit() {

  }
  onSelectStatus(status) {
    this.paymentsFilter.setPaymentStatus((status) ? status.value : null);
    this.paymentsStateService.onInitFilter(this.paymentsFilter);
    this.onChangeCounterFilter();
  }
  public onClearAll() {
    if (!this.customerPortalStateService.isCustomerPortal) this.companyDp.clearWithOutChanges();
    this.datesDp.clearWithOutChanges();
    this.statusDp.clearWithOutChanges();
    this.paymentsFilter.setStatus(null);
    this.paymentsFilter.setAmount(null);
    if (!this.customerPortalStateService.isCustomerPortal) this.paymentsFilter.setCompanyId(null);
    this.paymentsFilter.setStartDate(null);
    this.paymentsFilter.setEndDate(null);
    this.paymentsFilter.setInvoiceNumber(null);

    this.paymentsStateService.onInitFilter(this.paymentsFilter);
    this.onChangeCounterFilter();
    this.elRef.nativeElement.querySelector("#amount-filter").value = "";
  }

  public onSelectCompany(item) {
    if (!item) {
      this.paymentsFilter.setCompanyId(null);
    } else {
      this.paymentsFilter.setCompanyId(item.id);
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
    if (this.paymentsFilter.companyId) count++;
    if (this.paymentsFilter.endDate && this.paymentsFilter.startDate) count++;
    if (this.paymentsFilter.invoiceNumber) count++;
    if (this.paymentsFilter.paymentStatus) count++;
    if (this.paymentsFilter.amount) count++;
    this.changeCountFilter.emit(count);
  }
  public onSetAmountInvoice(event) {
    this.paymentsFilter.setAmount((event.target.value.length > 0) ? parseFloat(event.target.value).toFixed(2) : null);
    if (event.target.value.length > 0) this.elRef.nativeElement.querySelector("#amount-filter").value = this.paymentsFilter.amount;
    this.paymentsStateService.onInitFilter(this.paymentsFilter);
    this.onChangeCounterFilter();
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
