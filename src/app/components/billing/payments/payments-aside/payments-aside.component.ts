import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Payment } from '../class/payment';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import * as moment from "moment";
import { ConfirmStateService } from '../../../shared/confirm/services/confirm-state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PaymentsStateService } from 'src/app/states/payments/payments-state.service';
import { DELETE_PAYMENT } from 'src/app/const/confirm';
import { ConfirmComponent } from '../../../shared/confirm/confirm.component';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { PaymentsService } from 'src/app/services/payments/payments.service';

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
  isExistMultipleCompanies: boolean = false;
  constructor(public companiesStateService: CompaniesStateService,
    private modalService: NgbModal,
    private paymentsStateService: PaymentsStateService,
    public customerPortalStateService: CustomerPortalStateService,
    private permissionsService: PermissionsService,
    private paymentsService: PaymentsService,
    private confirmStateService: ConfirmStateService) { }

  ngOnInit() {
    this.currentCompany = this.companiesStateService.getCurrentCompany();
  }
  ngOnChanges() {
    this.company = this.companiesStateService.getCompanies().find(item => item.id === this.payment.clientCompanyId);
    this.isExistMultipleCompanies = this.payment.multipleCompanies.length > 0;

  }
  showRefund() {
    this.close();
    this.onRefundPayment.emit(this.payment);
  }
  showEdit() {
    this.close();
    this.onEditPayment.emit(this.payment);
  }
  resendPaymentReceipt() {
    this.paymentsService.resendPaymentReceipt(this.payment.id).subscribe(res => {

    })
  }
  deletePayment() {
    this.confirmStateService.setConfirmAction(DELETE_PAYMENT);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.header = 'Delete Payment';
    modalRef.componentInstance.message = `Are you sure you want to remove the payment?`;
    this.paymentsStateService.setPaymentForemove(this.payment);
  }
  parsePaymentMethod(method) {
    return method.split('_').map((el) => el[0].toUpperCase() + el.slice(1).toLowerCase()).join(' ');
  };
  getDate(date) {
    return moment(date).format('DD MMM YYYY');
  }
  close() {
    this.onClose.emit(null);
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  public trackById(index, item) {
    return item.id;
  }
}
