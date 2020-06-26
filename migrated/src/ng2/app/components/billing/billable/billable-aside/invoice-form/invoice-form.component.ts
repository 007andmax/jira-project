import { Component, OnInit, Input, OnDestroy, ViewChild } from '@angular/core';
import { InvoiceLock } from '../../class/invoice-lock';
import { Company } from 'src/ng2/app/interfaces/company/company';
import { CompanyProfile } from 'src/ng2/app/components/companies/class/company-profile';
import { BillableStateService } from 'src/ng2/app/states/billable/billable-state.service';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { CompanyUpdate } from 'src/ng2/app/components/companies/class/company-update';
import { Subscription } from 'rxjs';
import { InvoiceFormEditCustomerComponent } from './invoice-form-edit-customer/invoice-form-edit-customer.component';
import { PartialUpdate } from './class/partial-update';
import { BillableService } from 'src/ng2/app/services/billable/billable.service';
import { InvoiceTaxNumber } from '../../class/invoice-tax-number';
import { BillableTaimer } from '../class/billable-taimer';
import * as moment from "moment";

@Component({
  selector: 'app-invoice-form',
  templateUrl: './invoice-form.component.html',
  styleUrls: ['./invoice-form.component.scss']
})
export class InvoiceFormComponent implements OnInit, OnDestroy {
  @ViewChild('companyEdit') companyEdit: InvoiceFormEditCustomerComponent;
  @Input() invoice: InvoiceLock;
  @Input() invoiceNumber: string;
  
  @Input() company: CompanyProfile = new CompanyProfile();
  @Input() invoiceTaxNumber: InvoiceTaxNumber;
 
  currentCompany: any;
  sub: Subscription = new Subscription();
  constructor(private billableStateService: BillableStateService,
    private billableService: BillableService,
    private companiesStateService: CompaniesStateService) { }


  ngOnInit() {
    
    this.currentCompany = this.companiesStateService.getCurrentCompany();
    let getChangeCompanies = this.companiesStateService.getChangeCompanies().subscribe((data: CompanyUpdate) => {

      if (data.action === 'COMPANY_SAVED' && this.company.id === data.data.id) {

        this.company.name = data.data.name;
        this.company.contacts[0].firstName = data.data.companyInfo.contacts[0].firstName;
        this.company.contacts[0].lastName = data.data.companyInfo.contacts[0].lastName;
        this.company.addresses[0].addressWithSuitNumberAndPostalCode = data.data.companyInfo.addresses[0].addressWithSuitNumberAndPostalCode;
        this.company.contacts[0].primaryEmail = data.data.companyInfo.contacts[0].primaryEmail;

        console.log("this.company", this.company);
      }


    })
    this.sub.add(getChangeCompanies);
  }
  parseDateFromDatePicker(due) {
    let date = new Date(due); // timestamp from calendar	
    let timeOffset = this.currentCompany.addresses[0].timeZone.timeOffset;
    let current = new Date();
    if (date.getDate() !== current.getDate() || current.getMonth() !== date.getMonth()) {
      let dateDatePicker = new Date(due).getTime(); // timestamp from calendar	
      let finalDate = new Date(dateDatePicker - (current.getTimezoneOffset() * 60000/* dont touch*/) - timeOffset /* timezone.timeOffset */);
      return finalDate.getTime();
    } else {
      let currentTime = new Date(current.getFullYear(), current.getMonth(), current.getDate()).getTime();
      let finalDate = new Date(currentTime - (current.getTimezoneOffset() * 60000) - timeOffset);
      return finalDate.getTime();
    }

  }
  onChangeGSTNumber() {

  }
  public getDate(date) {
    return moment(new Date(date)).format('DD/MM/YYYY');
  }
  onChangeInvoiceNumber() {
    let request: PartialUpdate = new PartialUpdate(null, null, this.invoiceNumber, null, null);
    console.log("request", request);
    this.updateInvoiceData(request);
  }
  onChangeDate(date) {
    console.log("date", date);
    let invoiceDate = this.parseDateFromDatePicker(new Date(date.year, date.month - 1, date.day));
    console.log("invoiceDate", invoiceDate);
    let request: PartialUpdate = new PartialUpdate(invoiceDate, null, this.invoiceNumber, null, null);
    console.log("request", request);
    this.updateInvoiceData(request);
  }
  private updateInvoiceData(request) {
    this.billableService.updateInvoiceData(this.invoice.lockId, request).subscribe(data => {

    })
  }
  onChangeDueDate(date) {
    let dueDate = this.parseDateFromDatePicker(new Date(date.year, date.month - 1, date.day));

    let request: PartialUpdate = new PartialUpdate(null, dueDate, this.invoiceNumber, null, null);

    this.updateInvoiceData(request);

  }
  onUpdateCompany() {
    let data = this.companyEdit.getCompany();
    this.company.contacts[0].phoneNumbers = data.contacts[0].phoneNumbers;

  }
  onEditCustomer() {
    this.billableStateService.onEditCustomer(this.company);

  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
