import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CustomerSalesReport } from '../../class/customer-sales-report';
import * as moment from "moment";
import { ReportsStateService } from 'src/app/states/reports/reports-state.service';

@Component({
  selector: 'app-customer-sales-report',
  templateUrl: './customer-sales-report.component.html',
  styleUrls: ['./customer-sales-report.component.scss']
})
export class CustomerSalesReportComponent implements OnInit {
  customerSalesReport: CustomerSalesReport = new CustomerSalesReport();
  headers = [];
  list = [];
  selectedClient = null;
  loadingInProgress: boolean = false;
  constructor(private reportsStateService: ReportsStateService, public cd: ChangeDetectorRef,) { }

  ngOnInit() {
  }
  perseStartDate() {
    return moment(this.customerSalesReport.startDate).format('DD MMM YYYY')
  }
  perseEndDate() {
    return moment(this.customerSalesReport.endDate).format('DD MMM YYYY')
  }
  public onRequest(data) {
    this.loadingInProgress = data;
    this.cd.detectChanges();
  }
  onSelectedClient(client) {
    this.selectedClient = client;

  }
  public getReport(data) {
    this.customerSalesReport.setData(data);
    this.headers = [];
    this.list = [];
    if (this.customerSalesReport.type === 'DETAILED') {
      this.headers.push('Date');
      this.headers.push('Invoice');
      this.headers.push('Product/Service');
      this.headers.push('Serial #');
      this.headers.push('Qty');
      this.headers.push('Sale price');
      this.headers.push('Discount');
      this.customerSalesReport.lines.forEach(line => {
        let list = [];
        list.push(moment(line.date).format('DD.MM.YYYY'));
        list.push(`#${line.invoiceNumber}`);
        list.push(line.itemName);
        list.push(line.serial);
        list.push(line.quantity);
        list.push(`$${this.parseTotal(line.sale || 0)}`);
        list.push(`${line.discountAmount || 0}%`);
        list.push(`$${this.parseTotal(line.totalSum || 0)}`);

        this.list.push(list);
      })
    } else {
      this.headers.push('Customer');
      this.headers.push('Product Sales');
      this.headers.push('Service Sales');
      this.customerSalesReport.lines.forEach(line => {
        let list = [];

        list.push(line.companyName);
        list.push(`$${this.parseTotal(line.productsSum)}`);
        list.push(`$${this.parseTotal(line.servicesSum)}`);
        list.push(`$${this.parseTotal(line.totalSum)}`);
        this.list.push(list);
      })
      let list = [""];
      list.push(`$${this.parseTotal(this.customerSalesReport.productsSum)}`);
      list.push(`$${this.parseTotal(this.customerSalesReport.servicesSum)}`);
      list.push(`$${this.parseTotal(this.customerSalesReport.totalSum)}`);
      this.list.push(list);
    }
    this.headers.push('Total');

  }
  parseDate(date) {
    return moment(date).format('DD.MM.YYYY');
  }
  parseTotal(value) {
    return parseFloat(value.toString()).toFixed(2);
  }
}
