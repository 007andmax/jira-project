import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { Subscription } from 'rxjs';
import { InvoicesService } from 'src/app/services/invoices/invoices.service';
import { InvoicesFilter } from '../class/invoices-filter';
import { Invoice } from '../class/invoice';
import { FORMAT_DATE_2 } from 'src/app/const/date-picker';
import { CompanySetting } from '../../../companies/class/company-setting';
import * as moment from "moment";
import { Payment } from './class/payment';
import { PaymentInvoice } from './class/payment-invoice';
import { DisabledBtnDirective } from 'src/app/directives/disabled-btn.directive';
import { InvoiceStateService } from 'src/app/states/invoice/invoice-state.service';


@Component({
  selector: 'app-invoices-aside',
  templateUrl: './invoices-aside.component.html',
  styleUrls: ['./invoices-aside.component.scss']
})
export class InvoicesAsideComponent implements OnInit {
  companies = [];
  reqCompanies = [];
  validate: PaymentInvoice = new PaymentInvoice();
  payment: Payment = new Payment();
  amountReceived: number = 0;
  formatDate: string = FORMAT_DATE_2;
  today = new Date().getTime();
  invoices: Array<Invoice> = [];
  invoicesFilter: InvoicesFilter = new InvoicesFilter();
  paymentModes = [new CompanySetting('Cash', 'CASH'), new CompanySetting('Cheque', 'CHEQUE'), new CompanySetting('Debit Card', 'DEBIT_CARD'),
  new CompanySetting('Credit Card', 'CREDIT_CARD'),
  new CompanySetting('Wire Transfer', 'WIRE_TRANSFER')];
  selectedCompany: any = null;
  isChangeAmountReceived: boolean = false;
  selectAllInvoice: boolean = false;
  opened: boolean = false;
  selectedPaymentMode = new CompanySetting('Cheque', 'CHEQUE');
  sub: Subscription = new Subscription();
  @ViewChild('recordPayment') recordPayment: DisabledBtnDirective;
  selectedInvoices: Array<Invoice> = [];
  @Output() onClose = new EventEmitter<any>();
  constructor(private companiesState: CompaniesStateService,
    private invoiceStateService: InvoiceStateService,
    private invoicesService: InvoicesService) { }

  ngOnInit() {
    if (this.companiesState.getCompanies().length > 0) this.getClientsList(this.companiesState.getCompanies());
    let getOnCompanies = this.companiesState.getOnCompanies().subscribe((data) => {
      this.getClientsList(data);
    })
    this.sub.add(getOnCompanies);
    let getOpenAside = this.invoiceStateService.getOpenAside().subscribe(data => {
      this.opened = true;
      this.selectedInvoices = data;
      if (this.selectedInvoices.length > 0) {
        this.selectedCompany = this.reqCompanies.find(item => item.id === this.selectedInvoices[0].companyId);
        this.onSelectCompany(this.selectedCompany);
      }
      let today = new Date();
      this.payment.setDate(today.getDate(), today.getMonth() + 1, today.getFullYear(), this.companiesState.getCurrentCompany().addresses[0].timeZone.timeOffset);
    })
    this.sub.add(getOpenAside);
  }
  onSelectPaymentModes(data) {
    this.selectedPaymentMode = data;
    this.payment.setPaymentMethod(data.value);
  }
  onChangeAmountReceived(event) {
    this.amountReceived = Number(event.target.value);
    this.amountReceived = parseFloat((this.amountReceived).toFixed(2));
    this.isChangeAmountReceived = (this.amountReceived > 0);
    if (!this.validate.getAmountReceived()) this.validate.checkAmountReceived(this.amountReceived, this.invoices);
  }
  onSelectInvoice(index) {
    this.selectAllInvoice = true;
    let sumPayment = 0;
    this.invoices.forEach(item => {
      if (!item.selected) {
        this.selectAllInvoice = false;
        item.paymentAmount = 0;
      }
      if (item.selected) sumPayment += item.paymentAmount;
    })
    if (this.invoices[index].selected && sumPayment < this.amountReceived) {
      let paymentAmount = (this.amountReceived - sumPayment) - (this.invoices[index].totalSum - this.invoices[index].paidSum);
      this.invoices[index].paymentAmount = (paymentAmount > 0) ? (this.invoices[index].totalSum - this.invoices[index].paidSum) : (this.amountReceived - sumPayment);
    }
    if (!this.isChangeAmountReceived) {
      if (this.invoices[index].selected) this.invoices[index].paymentAmount = (this.invoices[index].totalSum - this.invoices[index].paidSum);
      this.amountReceived = this.invoices.reduce((a, b) => {
        if (b.selected) return a + (b.totalSum - b.paidSum);
        return a + 0;
      }, 0);;
    }
    if (!this.validate.getAmountReceived()) this.validate.checkAmountReceived(this.amountReceived, this.invoices);
  }
  clearAmounts() {
    this.invoices.forEach(item => {
      item.paymentAmount = 0;
    })
    this.amountReceived = 0;
  }
  public onChangePayment(val, invoice) {
    let value = Number(val.target.value);
    invoice.paymentAmount = parseFloat((((value) * 100) / 100).toFixed(2));
    this.validate.setValidPayment(true);
    if (!this.validate.getAmountReceived()) this.validate.checkAmountReceived(this.amountReceived, this.invoices);
  }
  create() {
    if (!this.validate.isValidate(this.amountReceived, this.invoices)) return;
    this.invoices.forEach(item => {
      if (item.selected) {
        this.payment.addInvoiceId(item.id);
        this.payment.addPartialPayment(item.id, item.paymentAmount);
      }
    })
    this.recordPayment.setDisabled(true);
    this.invoicesService.createPayment(this.payment).subscribe(data => {
      this.recordPayment.setDisabled(false);
      this.payment.resetInvoiceIds();
      this.payment.resetPartialPayments();
      this.close();
    }, err => {
      this.validate.setValidPayment(false);
      this.recordPayment.setDisabled(false);
      this.payment.resetInvoiceIds();
      this.payment.resetPartialPayments();
    })
  }
  public getUnUsedAmountReceived() {
    let totalPayment = this.getTotalPayment();
    return (this.amountReceived - totalPayment).toFixed(2);
  }
  getRemainingBalance() {
    let subTotal = this.getSubtotal();
    let totalPayment = this.amountReceived;
    return subTotal - totalPayment;
  }
  getTotalPayment() {
    let total = 0;
    this.invoices.forEach(item => {
      if (item.selected) total += item.paymentAmount;
    })
    return total;
  }
  checkShowClearAmounts() {
    return this.invoices.find(item => item.selected);
  }
  getSubtotal() {
    let subTotal = 0;
    this.invoices.forEach(item => {
      if (item.selected) subTotal += (item.totalSum - item.paidSum);
    })
    return subTotal;
  }
  onToggleAllInvoices(event) {
    let sumPayment = 0;
    this.invoices.forEach(item => {
      item.selected = event.target.checked;
      if (item.selected) sumPayment += item.paymentAmount;
      if (item.paymentAmount === 0) {
        if (sumPayment < this.amountReceived) {
          let paymentAmount = (this.amountReceived - sumPayment) - (item.totalSum - item.paidSum);
          item.paymentAmount = (paymentAmount > 0) ? (item.totalSum - item.paidSum) : (this.amountReceived - sumPayment);
        }
        if (!this.isChangeAmountReceived) item.paymentAmount = (item.totalSum - item.paidSum);
      }
    })
    if (!this.isChangeAmountReceived) this.amountReceived = this.invoices.reduce((a, b) => {
      if (b.selected) return a + (b.totalSum - b.paidSum);
      return a + 0;
    }, 0);
    if (!this.validate.getAmountReceived()) this.validate.checkAmountReceived(this.amountReceived, this.invoices);
  }
  onSelectCompany(item) {
    if (item) {
      this.invoicesFilter.setLimit(10000);
      this.invoicesFilter.setStatus("UNPAID");
      this.invoicesFilter.setCompany(item.name);
      this.invoicesService.getInvoices(this.invoicesFilter.getFIlter()).subscribe((data: Array<Invoice>) => {
        this.invoices = data;

        this.invoices.forEach(item => {
          let find = this.selectedInvoices.find(selectInvoice => selectInvoice.id === item.id);
          if (find) item.selected = true;
          if (item.selected && !this.isChangeAmountReceived) item.paymentAmount = parseFloat((item.totalSum - item.paidSum).toFixed(2)); ///Math.floor((item.sum - item.paidSum)*100)/100;
        })
        if (!this.isChangeAmountReceived) {
          this.amountReceived = this.invoices.reduce((a, b) => {
            if (b.selected) return parseFloat((a + (b.totalSum - b.paidSum)).toFixed(2));// Math.floor((a + (b.sum - b.paidSum))*100)/100;;
            return a + 0;
          }, 0);
        }
      })
      this.selectedCompany = item;
    } else {
      this.invoices = [];
      this.selectedCompany = null;
    }
  }
  getDate(date) {
    return (date) ? moment(date).format('DD MMM YYYY') : '';
  }
  onChangeDate(data) {
    this.payment.setDate(data.day, data.month, data.year, this.companiesState.getCurrentCompany().addresses[0].timeZone.timeOffset);
  }
  private getClientsList(data) {
    this.reqCompanies = data;
    this.companies = data.filter(item => item.accountType === 'CLIENT' && !item.deletedAt).sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
      1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
  }
  close() {

    this.opened = false;
    this.invoices = [];
    this.invoicesFilter = new InvoicesFilter();
    this.validate = new PaymentInvoice();
    this.payment = new Payment();
    this.amountReceived = 0;
    this.selectedCompany = null;
    this.isChangeAmountReceived = false;
    this.selectAllInvoice = false;
    this.selectedPaymentMode = new CompanySetting('Cheque', 'CHEQUE');
    this.invoiceStateService.onClosedAsige();
  }
  public trackById(index, item) {
    return item.id;
  }
}
