import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Payment } from '../class/payment';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import * as moment from "moment";
import { ConfirmStateService } from '../../../shared/confirm/services/confirm-state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PaymentsStateService } from 'src/ng2/app/states/payments/payments-state.service';
import { DELETE_PAYMENT } from 'src/ng2/app/const/confirm';
import { ConfirmComponent } from '../../../shared/confirm/confirm.component';

@Component({
  selector: 'app-payments-aside',
  templateUrl: './payments-aside.component.html',
  styleUrls: ['./payments-aside.component.scss']
})
export class PaymentsAsideComponent implements OnInit {
  @Input() payment: Payment;
  @Output() onClose = new EventEmitter<any>();
  @Output() onEditPayment = new EventEmitter<any>();
  @Output() onRefundPayment = new EventEmitter<any>();
  currentCompany: any;
  company: any;
  constructor(private companiesStateService: CompaniesStateService,
    private modalService: NgbModal,
    private paymentsStateService: PaymentsStateService,
    private confirmStateService: ConfirmStateService) { }

  ngOnInit() {
    this.currentCompany = this.companiesStateService.getCurrentCompany();
    this.company = this.companiesStateService.getCompanies().find(item => item.id === this.payment.clientCompanyId);
  }
  showRefund() {
    this.close();
    this.onRefundPayment.emit(this.payment);
  }
  showEdit() {
    this.close();
    this.onEditPayment.emit(this.payment);
  }
  deletePayment() {
    this.confirmStateService.setConfirmAction(DELETE_PAYMENT);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal' });
    modalRef.componentInstance.message = `Do you want to remove the payment?`;
    this.paymentsStateService.setPaymentForemove(this.payment);
  }
  getCompanyLogoUrl() {
    if (this.currentCompany && this.currentCompany.logo && this.currentCompany.logo && this.currentCompany.logo.base64 && !this.currentCompany.logo.cropped) return this.currentCompany.logo.base64;
    if (this.currentCompany && this.currentCompany.logo && this.currentCompany.logo.cropped && this.currentCompany.logo.cropped.id) return `/file/${this.currentCompany.logo.cropped.id}`;
    if (this.currentCompany && this.currentCompany.logo && this.currentCompany.logo.origin && this.currentCompany.logo.origin.id) return `/file/${this.currentCompany.logo.origin.id}`;
    return '/company/default/logo.jpg';
  }
  parsePaymentMethod(method) {
    return method.split('_').map((el) => el[0].toUpperCase() + el.slice(1).toLowerCase()).join(' ');
  };
  getDate(date) {
    return  moment(date).format('DD MMM YYYY');
  }
  close() {
    this.onClose.emit(null);
  }
  public trackById(index, item) {
    return item.id;
  }
}
