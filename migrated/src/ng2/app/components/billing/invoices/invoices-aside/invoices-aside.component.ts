import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { Subscription } from 'rxjs';
import { InvoicesService } from 'src/ng2/app/services/invoices/invoices.service';
import { InvoicesFilter } from '../class/invoices-filter';
import { Invoice } from '../class/invoice';
import { FORMAT_DATE_2 } from 'src/ng2/app/const/date-picker';
import { CompanySetting } from '../../../companies/class/company-setting';
import * as moment from "moment";


@Component({
  selector: 'app-invoices-aside',
  templateUrl: './invoices-aside.component.html',
  styleUrls: ['./invoices-aside.component.scss']
})
export class InvoicesAsideComponent implements OnInit {
  companies = [];
  reqCompanies = [];
  reference: string = '';
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
  sub: Subscription = new Subscription();
  @Input() selectedInvoices: Array<Invoice> = [];
  @Output() onClose = new EventEmitter<any>();
  constructor(private companiesState: CompaniesStateService,
    private invoicesService: InvoicesService) { }

  ngOnInit() {
    if (this.companiesState.getCompanies().length > 0) this.getClientsList(this.companiesState.getCompanies());
    let getOnCompanies = this.companiesState.getOnCompanies().subscribe((data) => {

      this.getClientsList(data);
    })
    this.sub.add(getOnCompanies);
    console.log("selectedInvoices", this.selectedInvoices);
    if (this.selectedInvoices.length > 0) {
      this.selectedCompany = this.reqCompanies.find(item => item.id === this.selectedInvoices[0].companyId);
      this.onSelectCompany(this.selectedCompany);
    }
    console.log("selectedCompany", this.selectedCompany);
  }
  onSelectPaymentModes(data) {

  }
  onChangeAmountReceived(event) {
    console.log("event", event.target.value);
    this.amountReceived = Number(event.target.value);
    this.isChangeAmountReceived = (this.amountReceived > 0);
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
    if (sumPayment < this.amountReceived) {
      let paymentAmount = (this.amountReceived - sumPayment) - (this.invoices[index].sum - this.invoices[index].paidSum);
      this.invoices[index].paymentAmount = (paymentAmount > 0) ? (this.invoices[index].sum - this.invoices[index].paidSum) : (this.amountReceived - sumPayment);
    }
    console.log("this.isChangeAmountReceived", this.isChangeAmountReceived);
    if (!this.isChangeAmountReceived) {
      this.invoices[index].paymentAmount = (this.invoices[index].sum - this.invoices[index].paidSum);
      this.amountReceived = this.invoices.reduce((a, b) =>{
        if (b.selected)  return a +(b.sum - b.paidSum);
        return a +0;
    }, 0);;
      console.log("this.amountReceived", this.amountReceived);
    }
    console.log("selectAllInvoice", this.selectAllInvoice);
  }
  clearAmounts() {
    this.invoices.forEach(item => {
      item.selected = false;
      item.paymentAmount = 0;
    })
    this.amountReceived = 0;
  }
  checkShowClearAmounts () {
   return this.invoices.find(item => item.selected);
  }
  getSubtotal() {
    let subTotal = 0;
    this.invoices.forEach(item => {
      if (item.selected) subTotal += (item.sum - item.paidSum);
    })
    return subTotal;
  }
  onToggleAllInvoices(event) {
    console.log(event.target.checked);
    this.invoices.forEach(item => {
      item.selected = event.target.checked;
    })
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
        })
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
  onChangeDate() {

  }
  private getClientsList(data) {
    this.reqCompanies = data;
    this.companies = data.filter(item => item.accountType === 'CLIENT' && !item.deletedAt).sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
      1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
  }
  close() {
    this.onClose.emit(null);
  }
}
