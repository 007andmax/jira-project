import { Component, OnInit } from '@angular/core';
import { BillableStateService } from 'src/ng2/app/states/billable/billable-state.service';
import { BillableService } from 'src/ng2/app/services/billable/billable.service';
import { InvoiceNote } from '../class/invoice-note';
import { InvoiceTaxNumber } from '../class/invoice-tax-number';
import { BillableProfile } from '../class/billable-profile';
import { InvoiceLock } from '../class/invoice-lock';
import { CompaniesService } from 'src/ng2/app/services/company/companies.service';
import { Company } from 'src/ng2/app/interfaces/company/company';
import { CompanyProfile } from '../../../companies/class/company-profile';

@Component({
  selector: 'app-billable-aside',
  templateUrl: './billable-aside.component.html',
  styleUrls: ['./billable-aside.component.scss']
})
export class BillableAsideComponent implements OnInit {
  opened: boolean = false;
  invoiceTaxNumber: InvoiceTaxNumber;
  invoiceNotes: Array<InvoiceNote> = [];
  billableProfile: BillableProfile;
  invoice: InvoiceLock;
  showPreloader: boolean = true;
  company: CompanyProfile = new CompanyProfile();
  invoiceNumber:string;
  constructor(private billableStateService: BillableStateService,
    private companiesService: CompaniesService,
    private billableService: BillableService) { }

  ngOnInit() {
    this.billableStateService.getOnCreate().subscribe(data => {
      this.billableProfile = this.billableStateService.getBillableProfile();
      this.opened = true;
     
      this.getInvoiceNote();
      this.getTaxNumber();
      this.getActualNumber();
      console.log("data",data);
      this.getInvoiceLock(data);
      // this.billableProfile = this.billableStateService.getBillableProfile();
    })
  }
  unlock() {
    this.billableService.unlock(this.invoice.lockId).subscribe(data => {
      this.opened = false;
    })
  }
  private getCompany(id) {
    this.companiesService.getCompany(id).subscribe((data:any) => {
      this.company.onEditMode(data);
      this.showPreloader = false;
    })
  }
  private getInvoiceNote() {
    this.billableService.getInvoiceNote().subscribe(data => {
      this.invoiceNotes = data;
      console.log("invoiceNotes", this.invoiceNotes);
    })
  }
  private getTaxNumber() {
    this.billableService.getTaxNumber().subscribe(data => {
      this.invoiceTaxNumber = data;
      console.log("invoiceTaxNumber", this.invoiceTaxNumber);
    })
  }
  private getActualNumber() {
    this.billableService.getActualNumber().subscribe((data:any) => {
      console.log("data", data);
      this.invoiceNumber = data.number;
    })
  }
  private getInvoiceLock(ticketsIds) {
    this.billableService.getInvoiceLock(ticketsIds).subscribe(data => {
      this.invoice = data;
      console.log("invoice", data);
      this.getInvoiceLockTime(this.invoice.lockId);
    })
  }
  private getInvoiceLockTime(id) {
    this.billableService.getInvoiceLockTime(id).subscribe(data => {
      console.log("data", data);
      this.getCompany(this.billableProfile.id);
     
    })
  }

}
