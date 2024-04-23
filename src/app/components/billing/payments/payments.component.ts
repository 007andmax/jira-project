import { Component, OnInit, ChangeDetectorRef, ViewChild, OnDestroy } from '@angular/core';
import { Payment } from './class/payment';
import { PaymentsFilter } from './class/payments-filter';
import { Subscription } from 'rxjs';
import { PaymentsService } from 'src/app/services/payments/payments.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { PaymentsStateService } from 'src/app/states/payments/payments-state.service';
import { ConfirmStateService } from '../../shared/confirm/services/confirm-state.service';
import { PaymentsListService } from './services/payments-list.service';
import { DELETE_PAYMENT } from 'src/app/const/confirm';
import { PaymentsRealTimeService } from 'src/app/states/payments/payments-real-time.service';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';
import { InvoiceStateService } from 'src/app/states/invoice/invoice-state.service';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';
import { WebsocketService } from 'src/app/services/websocket/websocket.service';

@Component({
  selector: 'payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss'],
  providers: [PaymentsListService]
})
export class PaymentsComponent implements OnInit, OnDestroy {

  paymentsFilter: PaymentsFilter = new PaymentsFilter();
  payments: Array<Payment> = [];
  showPendingPreloader: boolean = false;
  showPreloader: boolean = true;
  selectedCompanyId: string = null;
  public sort: string = '';
  public infiniteScrollDisabled = false;
  public page_number: number = 0;
  showDetailsPayment: boolean = false;
  showRefundPayment: boolean = false;
  showEditPayment: boolean = false;
  offset: number = 40;
  public direction: string = 'ASC';
  detailsPayment: Payment;
  refundPayment: Payment;
  editPayment: Payment;
  selectedPayments: Array<Payment> = [];
  sub: Subscription = new Subscription();
  container = document.body.querySelector(".main-container");
  constructor(private paymentsService: PaymentsService,
    public cd: ChangeDetectorRef,
    private invoiceStateService: InvoiceStateService,
    private companiesStateService: CompaniesStateService,
    private paymentsStateService: PaymentsStateService,
    private confirmStateService: ConfirmStateService,
    private paymentsRealTimeService: PaymentsRealTimeService,
    private leftPanelStateService: LeftPanelStateService,
    private customerPortalStateService: CustomerPortalStateService,
    private websocketService: WebsocketService,
    private paymentsListService: PaymentsListService) { }

  ngOnInit() {
    if (this.customerPortalStateService.isCustomerPortal) {
      this.paymentsFilter.setCompanyId(this.customerPortalStateService.getPaymentsFilter().companyId);
      this.websocketService.onInitConnectCustomerUser("new-payments-ng2", this.customerPortalStateService.getPaymentsFilter().companyId);
    }
    let onPaymentsFilters = this.customerPortalStateService.onPaymentsFilters.subscribe(data => {
      this.selectedPayments = [];
      this.selectedCompanyId = null;
      this.paymentsFilter.setCompanyId(this.customerPortalStateService.getPaymentsFilter().companyId);
      this.paymentsFilter.resetSortBy();
      this.showPreloader = true;
      document.body.querySelector(".main-container").scrollTo(0, 0);
      this.setDefaultScoll();
      this.onScroll();
    });
    this.sub.add(onPaymentsFilters);
    this.leftPanelStateService.setBillingPage('new-payments-ng2');
    document.body.querySelector(".main-container").scrollTo(0, 0);
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
      document.body.querySelector(".main-container").scrollTo(0, 0);
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
      this.paymentsStateService.setPayments(this.payments);
      this.cd.detectChanges();
    })
    this.sub.add(changePaymentsArray);
  }
  onCreatePayment() {
    this.invoiceStateService.onOpenAsige([]);
  }
  onEditPayment(data) {
    this.editPayment = data;
    this.showEditPayment = true;
  }
  onPreviewInvoice(data) {
    this.invoiceStateService.togglePreview(data);
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
    document.body.querySelector(".main-container").scrollTo(0, 0);
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
      this.payments = [...this.payments, ...data.map(item => new Payment(item))];
      this.infiniteScrollDisabled = false;
      if (data.length < this.offset) this.paymentsListService.setBlockList(true);
      this.page_number += 1;
      this.showPreloader = false;
      this.showPendingPreloader = false;
      this.paymentsStateService.setPayments(this.payments);
      this.cd.detectChanges();
    })
  }
  public setDefaultScoll() {
    this.page_number = 0;
    this.paymentsListService.setBlockList(false);
    this.payments = [];
  }
  ngOnDestroy(): void {
    if (this.customerPortalStateService.isCustomerPortal && this.paymentsRealTimeService.subsribeToPaymentsCustomerUsers) this.paymentsRealTimeService.subsribeToPaymentsCustomerUsers.unsubscribe();
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
