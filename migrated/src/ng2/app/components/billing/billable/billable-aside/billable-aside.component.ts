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
import { InvoiceRealTimeService } from 'src/ng2/app/states/invoice/invoice-real-time.service';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { InvoiceFormComponent } from './invoice-form/invoice-form.component';

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
  @ViewChild('formInvoice') formInvoice: InvoiceFormComponent;
  opened: boolean = false;
  invoiceTaxNumber: InvoiceTaxNumber;
  invoiceNotes: Array<InvoiceNote> = [];
  billableProfile: BillableProfile;
  invoice: InvoiceLock;
  showPreloader: boolean = true;
  isUdpateInvoice: boolean = false;
  showPreview: boolean = false;
  company: CompanyProfile = new CompanyProfile();
  invoiceNumber: string;
  isUnlock: boolean = false;
  isInit: boolean = false;
  billableTaimer: BillableTaimer;
  timer;
  apiUrl = environment.apiUrl;
  sub: Subscription = new Subscription();
  constructor(private billableStateService: BillableStateService,
    private companiesService: CompaniesService,
    public cd: ChangeDetectorRef,
    private companiesStateService: CompaniesStateService,
    private notificationStateService: NotificationStateService,
    private confirmStateService: ConfirmStateService,
    private invoiceRealTimeService: InvoiceRealTimeService,
    private billableService: BillableService) { }


  ngOnInit() {

    let changeNumber = this.invoiceRealTimeService.changeNumber.subscribe(data => {
      if (data.action === 'NUMBER_CHANGED' && !this.invoiceIsCreating()) {
        this.invoiceNumber = data.data.numPart;
        this.cd.detectChanges();
        this.formInvoice.onChangeInvoiceNumber();
      }

    })
    this.sub.add(changeNumber);
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === REMOVE_TICKET_INVOICE) {
          let lockedTickets = this.invoice.lockedTickets;
          let index = lockedTickets.findIndex(item => item === this.billableStateService.getLockedTicketForRemove());
          lockedTickets.splice(index, 1);
          this.billableService.unlock(this.invoice.lockId).subscribe(data => {
            this.isInit = false;
            this.isUnlock = true;
            this.clearTaimer();
            this.getInvoiceLock(lockedTickets);
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
      this.getInvoiceLock(data, true);
    })
    this.sub.add(getOnCreate);
  }
  public onUpdateInvoice(request) {
    this.isUdpateInvoice = true;
    this.billableService.updateInvoiceData(this.invoice.lockId, request).subscribe((data: any) => {
      this.invoice.setInvoiceDataDto(data.invoiceDataDto);
      this.isUdpateInvoice = false;
      this.formInvoice.onCancelTickets();
      this.cd.detectChanges();
    }, err => {
      this.isUdpateInvoice = false;
    })
  }
  private invoiceIsCreating() {
    return this.saveAndSendBtn.isBlock() && this.saveAndPrintBtn.isBlock() && this.saveAndDownloadBtn.isBlock();
  }
  unlock() {
    this.isUnlock = true;
    this.billableService.unlock(this.invoice.lockId).subscribe(data => {
      this.billableStateService.setGlobalNote(null);
      this.billableStateService.setRegulatNote(null);
      this.opened = false;
      this.isInit = false;
      this.showPreloader = true;
      this.clearTaimer();
    },err => {
      this.isUnlock = false;
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
      this.unlock();
      this.onShowNotificationAfterCreate();
      this.activeSaveBtns();
      this.moToBillable();
    })
  }
  saveAndPrint() {
    this.disabledSaveBtns();
    window.open(this.apiUrl + `/invoice/show/lock/${this.invoice.lockId}/pdf?isEditable=${true}&billTo=${this.invoice.invoiceDataDto.billTo[0].id}&shipTo=${this.invoice.invoiceDataDto.shipTo[0].id}`, "_blank");
    this.billableService.create(this.invoice.lockId, false, this.invoice.invoiceDataDto.billTo[0].id, this.invoice.invoiceDataDto.shipTo[0].id).subscribe(data => {
      this.unlock();
      this.onShowNotificationAfterCreate();
      this.activeSaveBtns();
      this.moToBillable();
    })
  }
  moToBillable() {
    let body = document.querySelector('.left-panel__category-wrap');
    var link = document.createElement('a');
    body.appendChild(link);
    link.href = `#/ng2/billable`;
    var e = document.createEvent('MouseEvents');
    e.initEvent('click', true, true);
    link.dispatchEvent(e);
  }
  saveAndDownload() {
    this.disabledSaveBtns();
    window.open(this.apiUrl + `/invoice/show/lock/${this.invoice.lockId}/pdf?isDownload=${true}&shipTo=${this.invoice.invoiceDataDto.shipTo[0].id}&billTo=${this.invoice.invoiceDataDto.billTo[0].id}.pdf`, "_blank");
    this.billableService.create(this.invoice.lockId, false, this.invoice.invoiceDataDto.billTo[0].id, this.invoice.invoiceDataDto.shipTo[0].id).subscribe(data => {
      this.unlock();
      this.onShowNotificationAfterCreate();
      this.activeSaveBtns();
      this.moToBillable();
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
    })
  }
  private getTaxNumber() {
    this.billableService.getTaxNumber().subscribe(data => {
      this.invoiceTaxNumber = data;
    })
  }
  private getActualNumber() {
    this.billableService.getActualNumber().subscribe((data: any) => {
      this.invoiceNumber = data.number;
    })
  }
  private getInvoiceLock(ticketsIds, getComapny = false) {
    this.billableService.getInvoiceLock(ticketsIds).subscribe(data => {
      this.invoice = data;
      this.getInvoiceLockTime(this.invoice.lockId, getComapny);
    })
  }
  private getInvoiceLockTime(id, getComapny) {
    this.billableService.getInvoiceLockTime(id).subscribe((data: any) => {
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
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
    if (!this.isUnlock && this.invoice) this.unlock();
  }
}
