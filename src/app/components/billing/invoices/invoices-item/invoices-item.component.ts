import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as moment from "moment";
import { Invoice } from '../class/invoice';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { InvoicesService } from 'src/app/services/invoices/invoices.service';
import { NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmStateService } from '../../../shared/confirm/services/confirm-state.service';
import { ROLLBACK_INVOICE, REFUND_PAYMENTS } from 'src/app/const/confirm';
import { ConfirmComponent } from '../../../shared/confirm/confirm.component';
import { InvoiceStateService } from 'src/app/states/invoice/invoice-state.service';
import { AppService } from 'src/app/states/app/app.service';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { ToastrProgressStateService } from 'src/app/states/toastr-progress/toastr-progress-state.service';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';
import { TicketsListService } from 'src/app/components/tickets/tickets/services/tickets-list.service';
import { UsersTableCompanyByComponent } from 'src/app/components/users/users-table/users-table-company-by/users-table-company-by.component';
@Component({
  standalone: true,
  imports: [FormsModule, CommonModule, NgbDropdownModule, UsersTableCompanyByComponent],
  selector: 'app-invoices-item',
  templateUrl: './invoices-item.component.html',
  styleUrls: ['./invoices-item.component.scss'],
  providers: [TicketsListService]
})
export class InvoicesItemComponent implements OnInit {
  @Input() invoice: Invoice;
  company: any;
  @Output() onPreviewInvoice = new EventEmitter<any>();
  @Output() onSelectInvoice = new EventEmitter<any>();
  allPayments = [];
  paymentSum: number;
  allPaymentsSum: number = 0;
  indexNoAvatar: number = 0;
  listColorNoAvatar = [];
  constructor(private companiesStateService: CompaniesStateService,
    private modalService: NgbModal,
    private invoiceStateService: InvoiceStateService,
    private confirmStateService: ConfirmStateService,
    private appService: AppService,
    private permissionsService: PermissionsService,
    private toastrProgressStateService: ToastrProgressStateService,
    public customerPortalStateService: CustomerPortalStateService,
    public ticketsListService: TicketsListService,
    private invoicesService: InvoicesService) { }

  ngOnInit() {
    this.listColorNoAvatar = this.ticketsListService.getListColorNoAvatar();
    this.indexNoAvatar = this.ticketsListService.randomInteger(0, 6);
    this.company = this.companiesStateService.getCompanies().find(item => item.id === this.invoice.companyId);
    if (this.invoice.payment) {
      this.paymentSum = this.invoice.payment.totalSum;
      this.allPayments.push(this.invoice.payment);
    }
    if (this.invoice.payment && this.invoice.partialPayments) {
      this.invoice.partialPayments.forEach((el) => {
        this.paymentSum -= el.partialPaidAmount;
      })
    }
    if (this.invoice.partialPayments) {
      this.invoice.partialPayments.forEach((el) => {
        this.allPayments.push(el);
      })
    }
    if (this.invoice.partialPayments && !this.invoice.payment) {
      this.allPaymentsSum = 0;
      this.invoice.partialPayments.forEach((el) => {
        this.allPaymentsSum += el.partialPaidAmount;
      })
    }
  }
  checkLogo() {
    return (this.company && this.company.logo && this.company.logo.cropped && this.company.logo.cropped.id || this.company && this.company.logo && this.company.logo.origin && this.company.logo.origin.id)
  }
  parseLogo() {
    if (this.checkLogo()) {
      return `url(${this.companiesStateService.getCompanyLogoUrl(this.company)}) center / cover no-repeat`;
    } else {
      return this.ticketsListService.getStyleAvatar(null, this.listColorNoAvatar[this.indexNoAvatar]);
    }
  }
  onChangeSelect() {
    this.onSelectInvoice.emit(true);
  }
  getDate(date) {
    return (date) ? moment(date).format('DD MMM YYYY') : '';
  }
  parsePaymentMethod(method) {
    return method.split('_').map((el) => el[0].toUpperCase() + el.slice(1).toLowerCase()).join(' ');
  };
  resendInvoices(withPdfAttachment) {
    this.invoicesService.resendInvoices([this.invoice.id], withPdfAttachment).subscribe(data => {

    })
  }
  markAsRead() {
    this.invoicesService.markAsRead(this.invoice.id).subscribe(data => {

    })
  }
  onShowPreviewInvoice() {
    if (this.getPermissions('VIEW_ACCOUNTING') || this.customerPortalStateService.isCustomerPortal) this.onPreviewInvoice.emit(this.invoice);
  }
  rollbackInvoice() {
    if (this.toastrProgressStateService.check(this.invoice.id)) return;
    this.confirmStateService.setConfirmAction(ROLLBACK_INVOICE);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.header = 'Rollback invoice';
    modalRef.componentInstance.message = `Are you sure you want to rollback invoice #${this.invoice.number}? 
    ${(this.invoice.ticketNumbers && this.invoice.ticketNumbers.length ? (this.invoice.ticketNumbers.length > 1 ? 'Tickets #' : 'Ticket #') +
        this.invoice.ticketNumbers.join(', #') + ' will be restored.' : '')}`;
    this.invoiceStateService.setInvoiceForRollback(this.invoice);
  }
  refundPayments() {
    if (this.toastrProgressStateService.check(this.invoice.id)) return;
    this.confirmStateService.setConfirmAction(REFUND_PAYMENTS);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.header = 'Refund Payment';
    modalRef.componentInstance.message = `Are you sure you want to refund the payment?`;
    this.invoiceStateService.setInvoiceForRefund(this.invoice);
  }
  exportAsPDF() {
    let company = this.companiesStateService.getCompanies().find(item => item.id === this.invoice.companyId);
    this.appService.download(`/invoice/show/${this.invoice.id}/pdf`, `${company.name}-${this.invoice.number}.pdf`);
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
}
