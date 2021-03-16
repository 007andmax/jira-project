import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { InvoicesService } from 'src/ng2/app/services/invoices/invoices.service';
import { Invoice } from '../class/invoice';
import { InvoiceProfile } from '../class/invoice-profile';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import * as moment from "moment";
import { AppService } from 'src/ng2/app/states/app/app.service';
import { ConfirmStateService } from '../../../shared/confirm/services/confirm-state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DELETE_INVOICE, ROLLBACK_INVOICE, REFUND_PAYMENTS } from 'src/ng2/app/const/confirm';
import { ConfirmComponent } from '../../../shared/confirm/confirm.component';
import { InvoiceStateService } from 'src/ng2/app/states/invoice/invoice-state.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-invoices-aside-preview',
  templateUrl: './invoices-aside-preview.component.html',
  styleUrls: ['./invoices-aside-preview.component.scss']
})
export class InvoicesAsidePreviewComponent implements OnInit {
  open: boolean = false;
  invoiceId: string;
  invoiceProfile: InvoiceProfile;
  @Output() onClose = new EventEmitter<any>();
  currentCompany: any;
  showPreloader: boolean = true;
  toggleStatus: boolean = true;
  sub: Subscription = new Subscription();
  constructor(private invoicesService: InvoicesService,
    private appService: AppService,
    private modalService: NgbModal,
    private confirmStateService: ConfirmStateService,
    private invoiceStateService: InvoiceStateService,
    private companiesStateService: CompaniesStateService) { }

  ngOnInit() {
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === DELETE_INVOICE || this.confirmStateService.getConfirmAction() === ROLLBACK_INVOICE || this.confirmStateService.getConfirmAction() === REFUND_PAYMENTS) this.close();
      }
    })
    this.sub.add(getConfirm);
    let openPreviewAside = this.invoiceStateService.openPreviewAside.subscribe(data => {
      this.currentCompany = this.companiesStateService.getCurrentCompany();
      this.invoiceId = data;
      this.open = true;
      this.onGetInvoice();
    })
    this.sub.add(openPreviewAside);
  }
  public onGetInvoice() {
    this.showPreloader = true;
    this.invoicesService.getInvoice(this.invoiceId).subscribe(data => {
      this.invoiceProfile = new InvoiceProfile(data);
      this.invoiceProfile.onCheckIsOverDue();
      this.invoiceProfile.setId(this.invoiceId);
      this.showPreloader = false;
    })
  }
  onCreatePayment() {
    this.invoiceStateService.onOpenAsige([this.invoiceProfile.getDataForRecordPayment()]);
  }
  resendInvoices() {
    this.invoicesService.resendInvoices([this.invoiceId]).subscribe(data => {
    })
  }
  refundPayments() {
    this.confirmStateService.setConfirmAction(REFUND_PAYMENTS);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal' });
    modalRef.componentInstance.message = `Invoice will be marked as not paid.`;
    this.invoiceStateService.setInvoiceForRefund(this.invoiceProfile);
  }
  rollbackInvoice() {
    this.confirmStateService.setConfirmAction(ROLLBACK_INVOICE);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal' });
    let ticketsNumbers = this.invoiceProfile.tickets.map(item => item.number);
    modalRef.componentInstance.message = `Do you want to rollback invoice #${this.invoiceProfile.number}? 
    ${(ticketsNumbers && ticketsNumbers.length ? (ticketsNumbers.length > 1 ? 'Tickets #' : 'Ticket #') +
        ticketsNumbers.join(', #') + ' will be restored.' : '')}`;
    this.invoiceStateService.setInvoiceForRollback(this.invoiceProfile);
  }
  getStatusDate(dateInvoice) {
    let date = new Date(dateInvoice);
    let typeTime = (date.getHours() > 12) ? "PM" : "AM",
      hours = (date.getHours() > 12) ? date.getHours() - 12 : date.getHours(),
      minutes = (date.getMinutes() > 10) ? date.getMinutes() : "0" + date.getMinutes();
    return `${this.getDateTicket(this.invoiceProfile.date)} ${(hours > 10) ? hours : "0" + hours}:${minutes} ${typeTime}`;
  }
  deleteInvoice() {
    this.confirmStateService.setConfirmAction(DELETE_INVOICE);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal' });
    modalRef.componentInstance.message = `Do you want to delete invoice #${this.invoiceProfile.number} ?`;
    this.invoiceStateService.setInvoiceForemove(this.invoiceProfile);
  }
  downloadPDF() {
    let company = this.companiesStateService.getCompanies().find(item => item.id === this.invoiceProfile.company.id);
    this.appService.download(`/invoice/show/${this.invoiceProfile.id}/pdf`, `${company.name}-${this.invoiceProfile.number}.pdf`);
  }
  print() {
    var wnd = window.open('/invoice/show/' + this.invoiceProfile.id + '/pdf');
    wnd.print();
  }

  public getDateTicket(date) {
    return moment(new Date(date)).format('DD/MM/YYYY');
  }
  getDate(date) {
    return (date) ? moment(date).format('DD MMM YYYY') : '';
  }
  getSelectedTaxes(taxes) {
    return taxes.map(item => {
      return `${item.name} ${item.rate}%`;
    }).join("<br>");
  }
  getDuration(input) {
    let timeInMinutes = input * 60,
      hours = Math.floor(timeInMinutes / 60),
      minutes = Math.round(timeInMinutes - (hours * 60));
    return (hours >= 10 ? hours : '0' + hours) + ':' + (minutes >= 10 ? minutes : '0' + minutes) + ' hr(s)';
  }
  getCompanyLogoUrl() {
    if (this.currentCompany && this.currentCompany.logo && this.currentCompany.logo && this.currentCompany.logo.base64 && !this.currentCompany.logo.cropped) return this.currentCompany.logo.base64;
    if (this.currentCompany && this.currentCompany.logo && this.currentCompany.logo.cropped && this.currentCompany.logo.cropped.id) return `/file/${this.currentCompany.logo.cropped.id}`;
    if (this.currentCompany && this.currentCompany.logo && this.currentCompany.logo.origin && this.currentCompany.logo.origin.id) return `/file/${this.currentCompany.logo.origin.id}`;
    return '/company/default/logo.jpg';
  }
  close() {
    this.onClose.emit(null);
    this.showPreloader = true;
    this.open = false;
    this.invoiceProfile = null;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
