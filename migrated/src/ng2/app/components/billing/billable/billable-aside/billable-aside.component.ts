import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { BillableStateService } from 'src/ng2/app/states/billable/billable-state.service';
import { BillableService } from 'src/ng2/app/services/billable/billable.service';
import { InvoiceNote } from '../class/invoice-note';
import { InvoiceTaxNumber } from '../class/invoice-tax-number';
import { BillableProfile } from '../class/billable-profile';
import { InvoiceLock } from '../class/invoice-lock';
import { CompaniesService } from 'src/ng2/app/services/company/companies.service';
import { Company } from 'src/ng2/app/interfaces/company/company';
import { CompanyProfile } from '../../../companies/class/company-profile';
import { Subscription } from 'rxjs';
import { BillableTaimer } from './class/billable-taimer';

@Component({
  selector: 'app-billable-aside',
  templateUrl: './billable-aside.component.html',
  styleUrls: ['./billable-aside.component.scss']
})
export class BillableAsideComponent implements OnInit, OnDestroy {
  opened: boolean = false;
  invoiceTaxNumber: InvoiceTaxNumber;
  invoiceNotes: Array<InvoiceNote> = [];
  billableProfile: BillableProfile;
  invoice: InvoiceLock;
  showPreloader: boolean = true;
  showPreview:boolean = false;
  company: CompanyProfile = new CompanyProfile();
  invoiceNumber: string;
  isUnlock: boolean = false;
  billableTaimer: BillableTaimer;
  timer;
  sub: Subscription = new Subscription();
  constructor(private billableStateService: BillableStateService,
    private companiesService: CompaniesService,
    public cd: ChangeDetectorRef,
    private billableService: BillableService) { }


  ngOnInit() {
    let getOnCreate = this.billableStateService.getOnCreate().subscribe(data => {
      this.billableProfile = this.billableStateService.getBillableProfile();
      this.opened = true;

      this.getInvoiceNote();
      this.getTaxNumber();
      this.getActualNumber();
      console.log("data", data);
      this.getInvoiceLock(data);
      // this.billableProfile = this.billableStateService.getBillableProfile();
    })
    this.sub.add(getOnCreate);
  }
  unlock() {
    this.billableService.unlock(this.invoice.lockId).subscribe(data => {
      this.opened = false;
      this.showPreloader = true;
      this.isUnlock = true;
      this.clearTaimer();
    })
  }
  private getCompany(id) {
    this.companiesService.getCompany(id).subscribe((data: any) => {
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
    this.billableService.getActualNumber().subscribe((data: any) => {
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
    this.billableService.getInvoiceLockTime(id).subscribe((data: any) => {
      console.log("data", data);
      this.billableTaimer = new BillableTaimer(data.time);
      this.timer = setInterval(() => {
        if (this.billableTaimer.seconds === 0) {
          this.billableTaimer.minutes--;
          this.billableTaimer.seconds = 59;
        }
        if (this.billableTaimer.minutes === - 1) this.clearTaimer();
        this.billableTaimer.seconds--;
        this.cd.detectChanges();
      }, 1000);
      this.getCompany(this.billableProfile.id);

    })
  }
  
  public clearTaimer() {
    clearTimeout(this.timer);
    this.billableTaimer.minutes = 0;
    this.billableTaimer.seconds = 0;
    this.billableTaimer.isFinished = true;
  }
  onPreview() {
    this.showPreview = true;
 /*   this.opened = false;
    this.showPreloader = true;
    this.clearTaimer();
    this.billableStateService.onPreview();*/
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
    if (!this.isUnlock) this.unlock();
  }
}
