import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { Payment } from '../class/payment';
import { FORMAT_DATE_2 } from 'src/ng2/app/const/date-picker';
import { EditPayment } from '../class/edit-payment';
import { PaymentInvoice } from '../../invoices/invoices-aside/class/payment-invoice';
import { CompanySetting } from '../../../companies/class/company-setting';
import { Subscription } from 'rxjs';
import * as moment from "moment";
import { PaymentsService } from 'src/ng2/app/services/payments/payments.service';
import { DisabledBtnDirective } from 'src/ng2/app/directives/disabled-btn.directive';

@Component({
  selector: 'app-edit-payment',
  templateUrl: './edit-payment.component.html',
  styleUrls: ['./edit-payment.component.scss']
})
export class EditPaymentComponent implements OnInit {
  @Input() payment: Payment;
  @Output() onClose = new EventEmitter<any>();
  validate: PaymentInvoice = new PaymentInvoice();
  amountReceived: number = 0;
  paymentModes = [new CompanySetting('Cash', 'CASH'), new CompanySetting('Cheque', 'CHEQUE'), new CompanySetting('Debit Card', 'DEBIT_CARD'),
  new CompanySetting('Credit Card', 'CREDIT_CARD'),
  new CompanySetting('Wire Transfer', 'WIRE_TRANSFER')];
  isChangeAmountReceived: boolean = false;
  selectedPaymentMode = new CompanySetting('Cheque', 'CHEQUE');
  editPayment: EditPayment;
  formatDate: string = FORMAT_DATE_2;
  companies = [];
  selectedCompany: any = null;
  @ViewChild('recordPayment') recordPayment: DisabledBtnDirective;
  sub: Subscription = new Subscription();
  constructor(private companiesState: CompaniesStateService,
    private paymentsService: PaymentsService,) { }

  ngOnInit() {
    this.editPayment = new EditPayment(JSON.parse(JSON.stringify(this.payment)));
    if (this.companiesState.getCompanies().length > 0) this.getClientsList(this.companiesState.getCompanies());
    let getOnCompanies = this.companiesState.getOnCompanies().subscribe((data) => {
      this.getClientsList(data);
    })
    this.amountReceived = this.editPayment.paymentData.reduce((a, b) => {
      return parseFloat((a + b.paidAmount).toFixed(2))
    }, 0);;
    this.sub.add(getOnCompanies);
  }
  private getClientsList(data) {
    this.companies = data.filter(item => item.accountType === 'CLIENT' && !item.deletedAt).sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
      1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
    this.selectedCompany = this.companies.find(item => item.id === this.payment.clientCompanyId);
  }
  onChangeDate(data) {
    this.editPayment.setDate(data.day, data.month, data.year, this.companiesState.getCurrentCompany().addresses[0].timeZone.timeOffset);
  }
  onChangeAmountReceived(event) {
    this.amountReceived = Number(event.target.value);
    this.isChangeAmountReceived = (this.amountReceived > 0);
    if (!this.validate.getAmountReceived()) this.validate.checkAmountReceivedEditAside(this.amountReceived, this.editPayment.paymentData);
  }
  public getUnUsedAmountReceived() {
    let totalPayment = this.getTotalPayment();
    return (this.amountReceived - totalPayment).toFixed(2);
  }
  onSelectPaymentModes(data) {
    this.selectedPaymentMode = data;
    this.editPayment.setPaymentMethod(data.value);
  }
  clearAmounts() {
    this.editPayment.paymentData.forEach(item => {
      item.paidAmount = 0;
    })
    this.amountReceived = 0;
  }
  getSubtotal() {
    let subTotal = 0;
    this.payment.paymentData.forEach(item => {
      subTotal += item.invoicePaidDue;
    })
    return subTotal;
  }
  public onChangePayment(val, invoice) {
    let value = Number(val);
    invoice.paidAmount = value;
    if (!this.validate.getAmountReceived()) this.validate.checkAmountReceivedEditAside(this.amountReceived, this.editPayment.paymentData);
  }
  getDate(date) {
    return (date) ? moment(date).format('DD MMM YYYY') : '';
  }
  checkShowClearAmounts() {
    return this.editPayment.paymentData.find(item => item.paidAmount > 0);
  }
  getTotalPayment() {
    let total = 0;
    this.editPayment.paymentData.forEach(item => {
      total += item.paidAmount;
    })
    return total;
  }
  edit() {
    if (!this.validate.isValidateEditAside(this.amountReceived, this.editPayment.paymentData)) return;
    this.recordPayment.setDisabled(true);
    this.paymentsService.editPayments(this.editPayment.getDataForRequest(this.payment)).subscribe(data => {
      this.recordPayment.setDisabled(false);
      this.close();
    }, err => {
      this.recordPayment.setDisabled(false);
    })
  }
  close() {
    this.onClose.emit(null);
  }
  public trackById(index, item) {
    return item.id;
  }
}
