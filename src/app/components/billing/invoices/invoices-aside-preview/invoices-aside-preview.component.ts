import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { InvoicesService } from 'src/app/services/invoices/invoices.service';
import { InvoiceProfile } from '../class/invoice-profile';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import * as moment from "moment";
import { AppService } from 'src/app/states/app/app.service';
import { ConfirmStateService } from '../../../shared/confirm/services/confirm-state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ROLLBACK_INVOICE, REFUND_PAYMENTS } from 'src/app/const/confirm';
import { ConfirmComponent } from '../../../shared/confirm/confirm.component';
import { InvoiceStateService } from 'src/app/states/invoice/invoice-state.service';
import { Subscription } from 'rxjs';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';
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
    private permissionsService: PermissionsService,
    public customerPortalStateService: CustomerPortalStateService,
    public companiesStateService: CompaniesStateService) { }

  ngOnInit() {
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === ROLLBACK_INVOICE || this.confirmStateService.getConfirmAction() === REFUND_PAYMENTS) this.close();
      }
    })
    this.sub.add(getConfirm);
    let openPreviewAside = this.invoiceStateService.openPreviewAside.subscribe(data => {
      if (!this.getPermissions('VIEW_ACCOUNTING') && !this.customerPortalStateService.isCustomerPortal) return;
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
  resendInvoices(withPdfAttachment) {
    this.invoicesService.resendInvoices([this.invoiceId], withPdfAttachment).subscribe(data => {
    })
  }
  refundPayments() {
    this.confirmStateService.setConfirmAction(REFUND_PAYMENTS);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.header = 'Refund Payment';
    modalRef.componentInstance.message = `Are you sure you want to refund the payment?`;
    this.invoiceStateService.setInvoiceForRefund(this.invoiceProfile);
  }
  rollbackInvoice() {
    this.confirmStateService.setConfirmAction(ROLLBACK_INVOICE);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    let ticketsNumbers = this.invoiceProfile.tickets.map(item => item.number);
    modalRef.componentInstance.header = 'Rollback invoice';
    modalRef.componentInstance.message = `Are you sure you want to rollback invoice #${this.invoiceProfile.number}? 
    ${(ticketsNumbers && ticketsNumbers.length ? (ticketsNumbers.length > 1 ? 'Tickets #' : 'Ticket #') +
        ticketsNumbers.join(', #') + ' will be restored.' : '')}`;
    this.invoiceStateService.setInvoiceForRollback(this.invoiceProfile);
  }
  getStatusDate(dateInvoice) {
    let date = new Date(dateInvoice);
    return `${this.getDateTicket(this.invoiceProfile.date)} ${moment(new Date(date)).format('hh:mm A')}`;
  }
  downloadPDF() {
    let company = this.companiesStateService.getCompanies().find(item => item.id === this.invoiceProfile.company.id);
    this.appService.download(`/invoice/show/${this.invoiceProfile.id}/pdf`, `${company.name}-${this.invoiceProfile.number}.pdf`);
  }
  print() {
    var wnd = window.open('/invoice/show/' + this.invoiceProfile.id + '/pdf');
    wnd.print();
  }
  getServiceTaxes(service) {
    if (service.taxes.length > 0) return this.getSelectedTaxes(service.taxes);
    if (service.taxes.length == 0) return this.getSelectedTaxes(service.taxes || []);
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

  close() {
    this.onClose.emit(null);
    this.showPreloader = true;
    this.open = false;
    this.invoiceProfile = null;
  }
  public trackById(index, item) {
    return item.id;
  }
  public trackByIndex(index, item) {
    return index;
  }
  getSubTotalWithDiscount() {
    return this.invoiceProfile.productsSum + this.invoiceProfile.servicesSum - (this.invoiceProfile.invoiceDiscount ? this.invoiceProfile.invoiceDiscount.amount : 0) - (this.invoiceProfile.discountSum ? this.invoiceProfile.discountSum : 0);
  }
  getSubTotal() {
    return this.invoiceProfile.productsSum + this.invoiceProfile.servicesSum;
  }
  getTotalDiscount() {
    return (this.invoiceProfile.invoiceDiscount ? this.invoiceProfile.invoiceDiscount.amount : 0) + (this.invoiceProfile.discountSum ? this.invoiceProfile.discountSum : 0);
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
