import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { InvoiceLock } from '../../class/invoice-lock';
import { Company } from 'src/app/interfaces/company/company';
import { CompanyProfile } from 'src/app/components/companies/class/company-profile';
import { BillableStateService } from 'src/app/states/billable/billable-state.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { CompanyUpdate } from 'src/app/components/companies/class/company-update';
import { Subscription } from 'rxjs';
import { InvoiceFormEditCustomerComponent } from './invoice-form-edit-customer/invoice-form-edit-customer.component';
import { PartialUpdate } from './class/partial-update';
import { BillableService } from 'src/app/services/billable/billable.service';
import { InvoiceTaxNumber } from '../../class/invoice-tax-number';
import { BillableTaimer } from '../class/billable-taimer';
import * as moment from "moment";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { REMOVE_TICKET_INVOICE } from 'src/app/const/confirm';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';
import { InvoiceTicketsService } from 'src/app/components/setting/invoice-tickets/invoice-tickets.service';
import { InvoiceNote } from '../../class/invoice-note';
import { NoteService } from 'src/app/services/note/note.service';
import { InvoiceValidate } from './class/invoice-validate';
import { InvoiceProfileTicket } from '../../class/invoice-profile-ticket';
import { FORMAT_DATE_2 } from 'src/app/const/date-picker';

@Component({
  selector: 'app-invoice-form',
  templateUrl: './invoice-form.component.html',
  styleUrls: ['./invoice-form.component.scss']
})
export class InvoiceFormComponent implements OnInit, OnDestroy {
  @ViewChild('companyEdit') companyEdit: InvoiceFormEditCustomerComponent;
  @Output() onUpdateInvoice = new EventEmitter();
  @Input() invoice: InvoiceLock;
  @Input() invoiceNumber: string;
  @Input() invoiceNotes: Array<InvoiceNote> = [];
  @Input() company: CompanyProfile = new CompanyProfile();
  @Input() invoiceTaxNumber: InvoiceTaxNumber;
  formatDate: string = FORMAT_DATE_2;
  toggleDiscount: boolean = false;
  currentCompany: any;
  changeGlobalNote: boolean = false;
  globalNote: InvoiceNote = null;
  validate: InvoiceValidate = new InvoiceValidate();
  sub: Subscription = new Subscription();
  editMode: boolean = false;
  editTickets: Array<InvoiceProfileTicket>;
  constructor(private billableStateService: BillableStateService,
    private billableService: BillableService,
    private modalService: NgbModal,
    private invoiceTicketsService: InvoiceTicketsService,
    private confirmStateService: ConfirmStateService,
    private elRef: ElementRef,
    public cd: ChangeDetectorRef,
    private noteService: NoteService,
    private companiesStateService: CompaniesStateService) { }


  ngOnInit() {
    this.onSetEditTickets();
    this.globalNote = this.invoiceNotes.filter(item => item.noteType === "GLOBAL")[0];
    if (this.billableStateService.getGlobalNote()) this.globalNote = this.billableStateService.getGlobalNote();
    this.currentCompany = this.companiesStateService.getCurrentCompany();
    if (this.invoice.invoiceDataDto.termsAndConditions) this.elRef.nativeElement.querySelector("#description-global-note").value = this.invoice.invoiceDataDto.termsAndConditions;
    this.billableStateService.setGlobalNote(this.globalNote);
    let getChangeCompanies = this.companiesStateService.getChangeCompanies().subscribe((data: CompanyUpdate) => {
      if (data.action === 'COMPANY_SAVED' && this.company.id === data.data.id) {
        this.company.name = data.data.name;
        this.company.contacts[0].firstName = data.data.companyInfo.contacts[0].firstName;
        this.company.contacts[0].lastName = data.data.companyInfo.contacts[0].lastName;
        this.company.addresses[0].addressWithSuitNumberAndPostalCode = data.data.companyInfo.addresses[0].addressWithSuitNumberAndPostalCode;
        this.company.contacts[0].primaryEmail = data.data.companyInfo.contacts[0].primaryEmail;
      }
    })
    this.sub.add(getChangeCompanies);
  }
  onDeleteDiscount(data) {
    this.toggleDiscount = false;
    this.invoice.setInvoiceDataDto(data.invoiceDataDto);
    this.cd.detectChanges();
  }
  onUpdateDiscount(data) {
    this.invoice.setInvoiceDataDto(data.invoiceDataDto);
    this.cd.detectChanges();
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
  onChangeTax() {
    let data = { "taxNumber": { "taxIdDescription": this.invoiceTaxNumber.taxIdDescription, "taxId": this.invoiceTaxNumber.taxId } };
    this.invoiceTicketsService.updateInvoiceContact(data).subscribe(res => {
    })
  }
  getDuration(input) {
    let timeInMinutes = input * 60,
      hours = Math.floor(timeInMinutes / 60),
      minutes = Math.round(timeInMinutes - (hours * 60));
    return (hours >= 10 ? hours : '0' + hours) + ':' + (minutes >= 10 ? minutes : '0' + minutes) + ' hr(s)';
  }
  private onSetEditTickets() {
    this.editTickets = this.invoice.invoiceDataDto.tickets.map(item => {
      return new InvoiceProfileTicket(JSON.parse(JSON.stringify(item)));
    })
  }

  onCheckUpdateGlobalNote() {
    if (this.globalNote) this.changeGlobalNote = true;
  }

  onUpdateGlobalNote() {
    this.invoiceTicketsService.updateTermsAndConditions(this.elRef.nativeElement.querySelector("#description-global-note").value).subscribe(data => {
      this.changeGlobalNote = false;
      this.billableStateService.setGlobalNote({
        id: this.globalNote.id,
        line1: this.elRef.nativeElement.querySelector("#description-global-note").value,
        line2: "",
        noteType: this.globalNote.noteType,
        title: this.globalNote.title
      })
    })
  }

  public getDate(date) {
    return moment(new Date(date)).format('DD/MM/YYYY');
  }
  public onChangeInvoiceNumber() {
    let request: PartialUpdate = new PartialUpdate(null, null, this.invoiceNumber, null, null, null);
    this.billableService.updateInvoiceData(this.invoice.lockId, request).subscribe(data => {
      this.validate.resetNumber();
    }, err => {
      this.validate.setNumberValid(false);
    })
  }
  onChangeDate(date) {
    let invoiceDate = this.parseDateFromDatePicker(new Date(date.year, date.month - 1, date.day));
    let request: PartialUpdate = new PartialUpdate(invoiceDate, null, this.invoiceNumber, null, null, null);
    this.updateInvoiceData(request);
    this.invoice.invoiceDataDto.date = invoiceDate;
  }
  public updateInvoiceData(request) {
    this.billableService.updateInvoiceData(this.invoice.lockId, request).subscribe(data => {
    })
  }
  onChangeDueDate(date) {
    let dueDate = this.parseDateFromDatePicker(new Date(date.year, date.month - 1, date.day));
    let request: PartialUpdate = new PartialUpdate(null, dueDate, this.invoiceNumber, null, null, null);
    this.updateInvoiceData(request);
    this.invoice.invoiceDataDto.dueDate = dueDate;
  }
  onEditTickets() {
    let expensesToUpdate = [];
    this.editTickets.forEach((item, index) => {
      expensesToUpdate = [...expensesToUpdate, ...item.getDateForUpdate()];
    });
    let request: PartialUpdate = new PartialUpdate(null, null, null, null, null, expensesToUpdate);
    this.onUpdateInvoice.emit(request);
  }
  public onCancelTickets() {
    this.onSetEditTickets();
    this.editMode = false;
  }
  onUpdateCompany() {
    let data = this.companyEdit.getCompany();
    this.company = data;
  }
  onEditCustomer() {
    this.billableStateService.onEditCustomer(this.company);
  }
  onUpdateSubjectTicket(subject, i) {
    this.invoice.invoiceDataDto.tickets[i].subject = subject;
  }
  delete(i) {
    this.confirmStateService.setConfirmAction(REMOVE_TICKET_INVOICE);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal' });
    modalRef.componentInstance.message = `Do you want to remove the ticket?`;
    this.billableStateService.setLockedTicketForRemove(this.invoice.lockedTickets[i]);
  }
  public trackByIndex(index, item) {
    return index;
  }
  public trackById(index, item) {
    return item.id;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
