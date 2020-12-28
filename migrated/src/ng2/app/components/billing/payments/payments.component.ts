import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Payment } from './class/payment';
import { PaymentsFilter } from './class/payments-filter';
import { Subscription } from 'rxjs';
import { PaymentsService } from 'src/ng2/app/services/payments/payments.service';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { PaymentsStateService } from 'src/ng2/app/states/payments/payments-state.service';
import { ConfirmStateService } from '../../shared/confirm/services/confirm-state.service';
import { PaymentsListService } from './services/payments-list.service';
import { DELETE_PAYMENT } from 'src/ng2/app/const/confirm';
import { Invoice } from '../invoices/class/invoice';
import { InvoicesAsidePreviewComponent } from '../invoices/invoices-aside-preview/invoices-aside-preview.component';
import { PaymentsRealTimeService } from 'src/ng2/app/states/payments/payments-real-time.service';
import { LeftPanelStateService } from 'src/ng2/app/states/left-panel/left-panel-state.service';

@Component({
  selector: 'payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss'],
  providers: [PaymentsListService]
})
export class PaymentsComponent implements OnInit {

  paymentsFilter: PaymentsFilter = new PaymentsFilter();
  payments: Array<Payment> = [];
  showPendingPreloader: boolean = false;
  showPreloader: boolean = true;
  selectedCompanyId: string = null;
  public sort: string = '';
  public infiniteScrollDisabled = false;
  public page_number: number = 0;
  showCreatePayment: boolean = false;
  showDetailsPayment: boolean = false;
  showRefundPayment: boolean = false;
  showEditPayment: boolean = false;
  offset: number = 20;
  public direction: string = 'ASC';
  detailsPayment: Payment;
  refundPayment: Payment;
  editPayment: Payment;
  previewInvoiceId: string;
  showPreviewInvoice: boolean = false;
  selectedPayments: Array<Payment> = [];
  @ViewChild('previewInvoiceAside') previewInvoiceAside: InvoicesAsidePreviewComponent;
  sub: Subscription = new Subscription();
  constructor(private paymentsService: PaymentsService,
    public cd: ChangeDetectorRef,
    private companiesStateService: CompaniesStateService,
    private paymentsStateService: PaymentsStateService,
    private confirmStateService: ConfirmStateService,
    private paymentsRealTimeService: PaymentsRealTimeService,
    private leftPanelStateService: LeftPanelStateService,
    private paymentsListService: PaymentsListService) { }

  ngOnInit() {
    this.leftPanelStateService.setBillingpage('new-payments-ng2');
    window.scrollTo(0, 0);
    if (this.companiesStateService.getCompanies().length > 0) this.onScroll();
    let getOnCompanies = this.companiesStateService.getOnCompanies().subscribe((data) => {
      this.onScroll();
    })
    this.sub.add(getOnCompanies);

    let getOnInitFilter = this.paymentsStateService.getOnInitFilter().subscribe(data => {
      this.selectedPayments = [];
      this.selectedCompanyId = null;
      this.paymentsFilter = data;
      this.paymentsFilter.resetSortBy();
      this.showPreloader = true;
      window.scrollTo(0, 0);
      this.setDefaultScoll();
      this.onScroll();
    })
    this.sub.add(getOnInitFilter);
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === DELETE_PAYMENT) {
          this.onRemovePayment(this.paymentsStateService.getPaymentForRemove());
        }
      }
    })
    this.sub.add(getConfirm);
    let changePaymentsArray = this.paymentsRealTimeService.changePaymentsArray.subscribe(data => {
      if (data.action === 'PAYMENT_CREATED') {
        let payment = new Payment(data.data);
        if (this.paymentsFilter.checkPaymentForAdd(payment)) this.payments.unshift(payment);
      }
      if (data.action === 'PAYMENTS_DELETED') {
        data.data.forEach(id => {
          let index = this.payments.findIndex(item => item.id === id);
          if (index > -1) this.payments.splice(index, 1);
        });
      }
      if (data.action === 'PAYMENTS_REFUNDED' || data.action === 'PAYMENT_EDITED') {
        let payment = new Payment(data.data);
        let index = this.payments.findIndex(item => item.id === payment.id);
        if (index > -1) this.payments[index] = payment;
      }
      this.cd.detectChanges();
    })
    this.sub.add(changePaymentsArray);
  }
  onCloseCreatePayment() {
    this.showCreatePayment = false;
  }
  onCreatePayment() {
    this.showCreatePayment = true;
  }
  onEditPayment(data) {
    this.editPayment = data;
    this.showEditPayment = true;
  }
  onPreviewInvoice(data) {
    this.previewInvoiceId = data;
    if (this.showPreviewInvoice) {
      this.cd.detectChanges();
      this.previewInvoiceAside.onGetInvoice();
    }
    this.showPreviewInvoice = true;
  }
  onRefundPayment(data) {
    this.refundPayment = data;
    this.showRefundPayment = true;
  }
  onDetailsPayment(data) {
    this.detailsPayment = data;
    this.showDetailsPayment = true;

  }
  onRemovePayment(payment) {
    this.paymentsService.deletePayment(payment).subscribe(data => {
    })
    this.showDetailsPayment = false;
    this.cd.detectChanges();
  }
  public sortBy(sort) {
    this.showPreloader = true;
    this.selectedPayments = [];
    this.selectedCompanyId = null;
    this.direction = this.paymentsListService.getDirection(this.direction, this.sort, sort);
    this.sort = sort;
    this.paymentsFilter.setSortBy(`${this.sort}_${this.direction}`);
    this.setDefaultScoll();
    window.scrollTo(0, 0);
    this.onScroll();
  }
  getInvoices() {
    if (this.paymentsListService.getBlockList()) {
      this.infiniteScrollDisabled = false;
      return;
    }
    this.paymentsFilter.setOffset(this.page_number * this.offset);
    if (this.page_number > 0) this.showPendingPreloader = true;
    this.paymentsService.getPayments(this.paymentsFilter.getFIlter()).subscribe((data: any) => {
      this.payments = [...this.payments, ...data];
      this.infiniteScrollDisabled = false;
      if (data.length < this.offset) this.paymentsListService.setBlockList(true);
      this.page_number += 1;
      this.showPreloader = false;
      this.showPendingPreloader = false;
      this.cd.detectChanges();
    })
  }
  public setDefaultScoll() {
    this.page_number = 0;
    this.paymentsListService.setBlockList(false);
    this.payments = [];
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
  public trackById(index, item) {
    return item.id;
  }
  public onScroll() {
    this.infiniteScrollDisabled = true;
    this.getInvoices();
  }
}
