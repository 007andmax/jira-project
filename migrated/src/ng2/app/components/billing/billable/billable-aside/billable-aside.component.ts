import { Component, OnInit, OnDestroy, ChangeDetectorRef, Output, EventEmitter, ViewChild } from '@angular/core';
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
import { ConfirmStateService } from '../../../shared/confirm/services/confirm-state.service';
import { REMOVE_TICKET_INVOICE } from 'src/ng2/app/const/confirm';
import { environment } from 'src/ng2/environments/environment';
import { NotificationStateService } from '../../../shared/notification/services/notification-state.service';
import { DisabledBtnDirective } from 'src/ng2/app/directives/disabled-btn.directive';

@Component({
  selector: 'app-billable-aside',
  templateUrl: './billable-aside.component.html',
  styleUrls: ['./billable-aside.component.scss']
})
export class BillableAsideComponent implements OnInit, OnDestroy {
  @Output() onSetSelectedTickets = new EventEmitter();
  @ViewChild('saveAndSendBtn') saveAndSendBtn: DisabledBtnDirective;
  @ViewChild('saveAndPrintBtn') saveAndPrintBtn: DisabledBtnDirective;
  @ViewChild('saveAndDownloadBtn') saveAndDownloadBtn: DisabledBtnDirective;
  
  
  opened: boolean = false;
  invoiceTaxNumber: InvoiceTaxNumber;
  invoiceNotes: Array<InvoiceNote> = [];
  billableProfile: BillableProfile;
  invoice: InvoiceLock;
  showPreloader: boolean = true;
  showPreview: boolean = false;
  company: CompanyProfile = new CompanyProfile();
  invoiceNumber: string;
  isUnlock: boolean = false;
  isInit:boolean = false;
  billableTaimer: BillableTaimer;
  timer;
  apiUrl = environment.apiUrl;
  sub: Subscription = new Subscription();
  constructor(private billableStateService: BillableStateService,
    private companiesService: CompaniesService,
    public cd: ChangeDetectorRef,
    private notificationStateService: NotificationStateService,
    private confirmStateService: ConfirmStateService,
    private billableService: BillableService) { }


  ngOnInit() {

    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === REMOVE_TICKET_INVOICE) {
          let lockedTickets = this.invoice.lockedTickets;
          let index = lockedTickets.findIndex(item => item === this.billableStateService.getLockedTicketForRemove());
          console.log("index",index);
          lockedTickets.splice(index, 1);
          console.log("lockedTickets",lockedTickets);

         let find =  this.billableProfile.tickets.filter(item => item.selected && item.id !== this.billableStateService.getLockedTicketForRemove())
     console.log("find",find);
         return;
          this.billableService.unlock(this.invoice.lockId).subscribe(data => {
            this.opened = false;

            this.isUnlock = true;
            this.clearTaimer();
            this.getInvoiceLock(lockedTickets);
            this.opened = true;
            this.showPreloader = true;
            this.onSetSelectedTickets.emit(lockedTickets);
          })
        }
      }
    })
    this.sub.add(getConfirm);
    let getOnCreate = this.billableStateService.getOnCreate().subscribe(data => {
      this.billableProfile = this.billableStateService.getBillableProfile();
      this.opened = true;

      this.getInvoiceNote();
      this.getTaxNumber();
      this.getActualNumber();
      console.log("data", data);
      this.getInvoiceLock(data, true);
      // this.billableProfile = this.billableStateService.getBillableProfile();
    })
    this.sub.add(getOnCreate);
  }
  unlock() {
    this.billableService.unlock(this.invoice.lockId).subscribe(data => {
      this.opened = false;
      this.isInit = false;
      this.showPreloader = true;
      this.isUnlock = true;
      this.clearTaimer();
    })
  }
  onShowNotificationAfterCreate() {
    this.notificationStateService.oninitShowNotification("The invoice has been created");
  }
  disabledSaveBtns() {
    this.saveAndSendBtn.setDisabled(true);
    this.saveAndPrintBtn.setDisabled(true);
    this.saveAndDownloadBtn.setDisabled(true);
  }
  activeSaveBtns() {
    this.saveAndSendBtn.setDisabled(false);
    this.saveAndPrintBtn.setDisabled(false);
    this.saveAndDownloadBtn.setDisabled(false);
  }
  saveAndSend() {
    this.disabledSaveBtns();
    this.billableService.create(this.invoice.lockId, true, this.invoice.invoiceDataDto.billTo[0].id, this.invoice.invoiceDataDto.shipTo[0].id).subscribe(data => {
      //  http://localhost:4200/invoice/show/lock/a6e7c281-587a-4017-af31-fbf18b07d5e8/pdf?isEditable=true&shipTo=aea6cb98-9302-42b7-b013-681232f058d2&billTo=aea6cb98-9302-42b7-b013-681232f058d2
      this.unlock();
      this.onShowNotificationAfterCreate();
     this.activeSaveBtns();
    })
  }
  saveAndPrint() {
    this.disabledSaveBtns();
    window.open(this.apiUrl + `/invoice/show/lock/${this.invoice.lockId}/pdf?isEditable=${true}&billTo=${this.invoice.invoiceDataDto.billTo[0].id}&shipTo=${this.invoice.invoiceDataDto.shipTo[0].id}`, "_blank");
    this.billableService.create(this.invoice.lockId, false, this.invoice.invoiceDataDto.billTo[0].id, this.invoice.invoiceDataDto.shipTo[0].id).subscribe(data => {
      //  http://localhost:4200/invoice/show/lock/a6e7c281-587a-4017-af31-fbf18b07d5e8/pdf?isEditable=true&shipTo=aea6cb98-9302-42b7-b013-681232f058d2&billTo=aea6cb98-9302-42b7-b013-681232f058d2
      this.unlock();
      this.onShowNotificationAfterCreate();
      this.activeSaveBtns();
    })
  }
  saveAndDownload() {
    this.disabledSaveBtns();
    window.open(this.apiUrl + `/invoice/show/lock/${this.invoice.lockId}/pdf?isDownload=${true}&shipTo=${this.invoice.invoiceDataDto.shipTo[0].id}&billTo=${this.invoice.invoiceDataDto.billTo[0].id}.pdf`, "_blank");
    this.billableService.create(this.invoice.lockId, false, this.invoice.invoiceDataDto.billTo[0].id, this.invoice.invoiceDataDto.shipTo[0].id).subscribe(data => {
      //  http://localhost:4200/invoice/show/lock/a6e7c281-587a-4017-af31-fbf18b07d5e8/pdf?isEditable=true&shipTo=aea6cb98-9302-42b7-b013-681232f058d2&billTo=aea6cb98-9302-42b7-b013-681232f058d2
      this.unlock();
      this.onShowNotificationAfterCreate();
      this.activeSaveBtns();
    })
  }
  private getCompany(id) {
    this.companiesService.getCompany(id).subscribe((data: any) => {
      this.company.onEditMode(data);
      this.showPreloader = false;
      this.isInit = true;
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
  private getInvoiceLock(ticketsIds, getComapny = false) {
    this.billableService.getInvoiceLock(ticketsIds).subscribe(data => {
      this.invoice = data;
      console.log("invoice", data);
      this.getInvoiceLockTime(this.invoice.lockId, getComapny);
    })
  }
  private getInvoiceLockTime(id, getComapny) {
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
      if (getComapny) this.getCompany(this.billableProfile.id);
      if (!getComapny) {
        this.showPreloader = false;
        this.isInit = true;
      } 
    })
  }

  public clearTaimer() {
    clearInterval(this.timer);
    this.billableTaimer.minutes = 0;
    this.billableTaimer.seconds = 0;
    this.billableTaimer.isFinished = true;
    this.showPreview = false;
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
