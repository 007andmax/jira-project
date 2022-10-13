import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { Subscription } from 'rxjs';
import { InvoicesFilter } from '../../class/invoices-filter';
import { InvoiceStateService } from 'src/app/states/invoice/invoice-state.service';
import { MultiDatepickerComponent } from 'src/app/components/shared/multi-datepicker/multi-datepicker.component';
import { CompanySetting } from 'src/app/components/companies/class/company-setting';
import { CompanyDropDownComponent } from 'src/app/components/shared/company-drop-down/company-drop-down.component';
import { DropDownComponent } from 'src/app/components/shared/drop-down/drop-down.component';

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
    private invoiceStateService: InvoiceStateService) { }

  ngOnInit() {
  }
  onSelectStatus(status) {
    this.invoicesFilter.setStatus((status) ? status.value : null);
    this.invoiceStateService.onInitFilter(this.invoicesFilter);
    this.onChangeCounterFilter();
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
    this.invoicesFilter.setAmount(null);
    this.elRef.nativeElement.querySelector("#amount-filter").value = "";
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
    if (this.invoicesFilter.companyName) count++;
    if (this.invoicesFilter.endDate && this.invoicesFilter.startDate) count++;
    if (this.invoicesFilter.invoiceNumber) count++;
    if (this.invoicesFilter.status) count++;
    if (this.invoicesFilter.amount) count++;
    this.changeCountFilter.emit(count);
  }
}
