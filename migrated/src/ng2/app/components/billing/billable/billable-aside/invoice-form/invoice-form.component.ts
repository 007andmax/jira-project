import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef } from '@angular/core';
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
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmStateService } from 'src/ng2/app/components/shared/confirm/services/confirm-state.service';
import { REMOVE_TICKET_INVOICE } from 'src/ng2/app/const/confirm';
import { ConfirmComponent } from 'src/ng2/app/components/shared/confirm/confirm.component';
import { InvoiceTicketsService } from 'src/ng2/app/components/setting/invoice-tickets/invoice-tickets.service';
import { InvoiceNote } from '../../class/invoice-note';
import { NoteService } from 'src/ng2/app/services/note/note.service';

@Component({
  selector: 'app-invoice-form',
  templateUrl: './invoice-form.component.html',
  styleUrls: ['./invoice-form.component.scss']
})
export class InvoiceFormComponent implements OnInit, OnDestroy {
  @ViewChild('companyEdit') companyEdit: InvoiceFormEditCustomerComponent;
  @Input() invoice: InvoiceLock;
  @Input() invoiceNumber: string;
  @Input() invoiceNotes: Array<InvoiceNote> = [];
  @Input() company: CompanyProfile = new CompanyProfile();
  @Input() invoiceTaxNumber: InvoiceTaxNumber;
  selectedNote: InvoiceNote = null;
  toogleCustomerNote: boolean = false;
  currentCompany: any;
  changeRegularNote: boolean = false;
  changeGlobalNote: boolean = false;
  regularNotes: Array<InvoiceNote> = [];
  globalNote: InvoiceNote = null;
  sub: Subscription = new Subscription();
  constructor(private billableStateService: BillableStateService,
    private billableService: BillableService,
    private modalService: NgbModal,
    private invoiceTicketsService: InvoiceTicketsService,
    private confirmStateService: ConfirmStateService,
    private elRef: ElementRef,
    private noteService: NoteService,
    private companiesStateService: CompaniesStateService) { }


  ngOnInit() {
    this.regularNotes = this.invoiceNotes.filter(item => item.noteType === "REGULAR");
    this.globalNote = this.invoiceNotes.filter(item => item.noteType === "GLOBAL")[0];
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
  onChangeTax() {
    let data = { "taxNumber": { "taxIdDescription": this.invoiceTaxNumber.taxIdDescription, "taxId": this.invoiceTaxNumber.taxId } };

    this.invoiceTicketsService.updateInvoiceContact(data).subscribe(res => {

    })
  }
  getDuration(input) {
    var timeInMinutes = input * 60,
      hours = Math.floor(timeInMinutes / 60),
      minutes = Math.round(timeInMinutes - (hours * 60));

    return (hours >= 10 ? hours : '0' + hours) + ':' + (minutes >= 10 ? minutes : '0' + minutes) + ' hr(s)';

  }
  onCheckUpdateTitleNote(data) {
    if (this.selectedNote) {
      this.changeRegularNote = true;
      this.selectedNote.title = data;
      console.log("data", data);
    }

  }
  onCheckUpdateDescriptionNote() {
    if (this.selectedNote) this.changeRegularNote = true;

  }
  onCheckUpdateGlobalNote() {
    if (this.globalNote) this.changeGlobalNote = true;

  }
  onUpdateRegularNote() {
    this.noteService.updateNote({ "title": this.selectedNote.title, "line1": this.elRef.nativeElement.querySelector("#description-regular-note").value, "line2": "" }, this.selectedNote.id).subscribe(data => {
      this.changeRegularNote = false;
    })
  }
  onUpdateGlobalNote() {
    this.noteService.updateNote({ "title": this.globalNote.title, "line1": this.elRef.nativeElement.querySelector("#description-global-note").value, "line2": "" }, this.globalNote.id).subscribe(data => {
      this.changeGlobalNote = false;
    })
  }
  onSelectNotes(data) {
    this.selectedNote = data;
    console.log("selectedNote", this.selectedNote);
    if (this.selectedNote) {
      let request: PartialUpdate = new PartialUpdate(null, null, null, this.selectedNote, null);
      console.log("request", request);
      this.updateInvoiceData(request);
      this.elRef.nativeElement.querySelector("#description-regular-note").value = this.selectedNote.line1;

    } else {
      this.changeRegularNote = false;
      this.elRef.nativeElement.querySelector("#description-regular-note").value = "";
    }
  }
  onChangeDescriptionNote() {
    let request: PartialUpdate = new PartialUpdate(null, null, null, this.selectedNote, null);
    console.log("request", request);
    this.updateInvoiceData(request);
  }
  getLenRegularNotes() {
    return this.invoiceNotes.filter(item => item.noteType === "REGULAR").length;
  }
  onChangeRegularNote() {
    console.log("onChangeRegularNote");
    if (this.selectedNote) {
      let selectedNote = JSON.parse(JSON.stringify(this.selectedNote));
      selectedNote.line1 = this.elRef.nativeElement.querySelector("#description-regular-note").value;
      let request: PartialUpdate = new PartialUpdate(null, null, null, selectedNote, null);
      console.log("request", request);
      this.updateInvoiceData(request);

    } else {
      let selectedNote = new InvoiceNote({
        line1: this.elRef.nativeElement.querySelector("#description-regular-note").value,
        line2: "",
        noteType: "REGULAR",
        suggestedNote: false,
      });
      let request: PartialUpdate = new PartialUpdate(null, null, null, selectedNote, null);
      console.log("request", request);
      this.updateInvoiceData(request);

    }

  }
    getInvoiceNote() {
    this.billableService.getInvoiceNote().subscribe(data => {
      this.invoiceNotes = data;
      this.regularNotes = this.invoiceNotes.filter(item => item.noteType === "REGULAR");
      console.log("regularNotes", this.regularNotes);
    })
  }
  onSetRegularNote(data) {
    console.log("data", data);
    this.selectedNote.title = data;
    this.changeRegularNote = true;
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
  delete(ticket) {
    this.confirmStateService.setConfirmAction(REMOVE_TICKET_INVOICE);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal' });

    modalRef.componentInstance.message = `Do you want to remove the ticket?`;
    this.billableStateService.setLockedTicketForRemove(ticket.id);
  }
  public trackById(index, item) {
    return item.id;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
