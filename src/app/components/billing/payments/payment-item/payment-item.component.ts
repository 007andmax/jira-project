import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Payment } from '../class/payment';
import { NgbDropdownModule, NgbModal, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmStateService } from '../../../shared/confirm/services/confirm-state.service';
import { PaymentsStateService } from 'src/app/states/payments/payments-state.service';
import * as moment from "moment";
import { DELETE_PAYMENT } from 'src/app/const/confirm';
import { ConfirmComponent } from '../../../shared/confirm/confirm.component';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { AppService } from 'src/app/states/app/app.service';

@Component({
  standalone: true,
  imports: [CommonModule, NgbDropdownModule, NgbTooltipModule],
  selector: 'app-payment-item',
  templateUrl: './payment-item.component.html',
  styleUrls: ['./payment-item.component.scss'],

})
export class PaymentItemComponent implements OnInit {
  @Input() payment: Payment;
  company: any;
  @Output() onDetailsPayment = new EventEmitter<any>();
  @Output() onRefundPayment = new EventEmitter<any>();
  @Output() onPreviewInvoice = new EventEmitter<any>();
  @Output() onEditPayment = new EventEmitter<any>();
  @Output() onResendPaymentReceipt = new EventEmitter<any>();
  allPayments = [];
  paymentSum: number;
  allPaymentsSum: number = 0;
  constructor(
    private appService: AppService,
    private modalService: NgbModal,
    private paymentsStateService: PaymentsStateService,
    public customerPortalStateService: CustomerPortalStateService,
    private usersStateService: UsersStateService,
    private permissionsService: PermissionsService,
    private confirmStateService: ConfirmStateService,) { }

  ngOnInit() {

  }
  downloadPDF() {
    this.appService.download(`/payments/pdf/${this.payment.id}`, `${this.payment.clientCompanyName}.pdf`);
  }
  public getDate() {
    return moment(this.payment.createdAt).format('DD MMM YYYY');
  }
  showEditPayment() {
    this.onEditPayment.emit(this.payment);
  }
  showDetailsPayment() {
    this.onDetailsPayment.emit(this.payment);
  }
  showRefundPayment() {
    this.onRefundPayment.emit(this.payment);
  }
  resendPaymentReceipt() {
    this.onResendPaymentReceipt.emit(this.payment);
  }
  onShowPreviewInvoice(index) {
    if (this.usersStateService.getCurrentUser().accountType == "CLIENT") {
      if (!this.getCompanyInfoPermissions('VIEW_ALL_PAYMENTS') || !this.getCompanyInfoPermissions('VIEW_ALL_INVOICES')) return;
    }
    this.onPreviewInvoice.emit(this.payment.paymentData[index].invoiceId);
  }
  public getCompanyInfoPermissions(action) {
    return (this.usersStateService.getCurrentUser() && this.usersStateService.getCurrentUser().accountType == "CLIENT" && this.usersStateService.getCurrentUser().customerCompaniesInfo.some(compnayInfo => compnayInfo.customerUserRole.getPermission(action)));
  }
  parseStatus() {
    return this.payment.paymentStatus ? this.payment.paymentStatus.split('_').map((el) => el[0].toUpperCase() + el.slice(1).toLowerCase()).join(' ') : '';
  }
  getInvoices() {
    let invoices = [];
    invoices = this.payment.paymentData.map(item => {
      return item.invoiceNumber;
    })
    return (invoices) ? invoices.join("<br/>") : '';
  }
  parsePaymentMethod(method) {
    return method.split('_').map((el) => el[0].toUpperCase() + el.slice(1).toLowerCase()).join(' ');
  };

  deletePayment() {
    this.confirmStateService.setConfirmAction(DELETE_PAYMENT);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.header = 'Delete Payment';
    modalRef.componentInstance.message = `Are you sure you want to remove the payment?`;
    this.paymentsStateService.setPaymentForemove(this.payment);
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  public trackById(index, item) {
    return item.id;
  }
}
