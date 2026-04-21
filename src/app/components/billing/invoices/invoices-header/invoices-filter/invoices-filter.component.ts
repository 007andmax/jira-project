import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, OnDestroy } from '@angular/core';
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
  standalone: true,
  imports: [FormsModule, CommonModule],
    selector: 'app-invoices-filter',
    templateUrl: './invoices-filter.component.html',
    styleUrls: ['./invoices-filter.component.scss'],
    standalone: true
})
export class InvoicesFilterComponent implements OnInit, OnDestroy {
  @ViewChild('companyDp', { static: true }) companyDp: CompanyDropDownComponent;
  @ViewChild('statusDp', { static: true }) statusDp: DropDownComponent;
  @ViewChild('datesDp', { static: true }) datesDp: MultiDatepickerComponent;
  sub: Subscription = new Subscription();
  invoicesFilter: InvoicesFilter = new InvoicesFilter();
  @Output() changeCountFilter = new EventEmitter<any>();
  statusTypes = [new CompanySetting('Paid invoices', 'PAID'), new CompanySetting('Unpaid invoices', 'UNPAID'), new CompanySetting('Overdue invoices', 'OVERDUE'), new CompanySetting('Deleted invoices', 'DELETED')];
  constructor(private companiesState: CompaniesStateService,
    private elRef: ElementRef,
    private customerPortalStateService: CustomerPortalStateService,
    private invoiceStateService: InvoiceStateService) { }


  ngOnInit() {

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
    if (!this.customerPortalStateService.isCustomerPortal) this.invoicesFilter.setCompanyIds([]);
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
      this.invoicesFilter.setCompanyIds([]);
    } else {
      this.invoicesFilter.setCompanyIds([item.id]);
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
    if (this.invoicesFilter.companyIds.length > 0) count++;
    if (this.invoicesFilter.endDate && this.invoicesFilter.startDate) count++;
    if (this.invoicesFilter.invoiceNumber) count++;
    if (this.invoicesFilter.status) count++;
    if (this.invoicesFilter.amount) count++;
    this.changeCountFilter.emit(count);
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
