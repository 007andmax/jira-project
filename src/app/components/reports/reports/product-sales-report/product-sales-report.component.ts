
import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ProductSalesReport } from '../../class/product-sales-report';
import * as moment from "moment";
import { OverviewReportComponent } from '../../overview-report/overview-report.component';
import { ReportMenuComponent } from '../../report-menu/report-menu.component';
import { OverviewProductSalesReportComponent } from '../../overview-report/overview-product-sales-report/overview-product-sales-report.component';

@Component({
  standalone: true,
  imports: [ReportMenuComponent, CommonModule, OverviewProductSalesReportComponent],
  selector: 'app-product-sales-report',
  templateUrl: './product-sales-report.component.html',
  styleUrls: ['./product-sales-report.component.scss'],

})
export class ProductSalesReportComponent implements OnInit {
  productSalesReport: ProductSalesReport = new ProductSalesReport();
  headers = [];
  list = [];
  styles = [];
  classes = [];
  selectedClient = null;
  loadingInProgress: boolean = false;
  constructor(public cd: ChangeDetectorRef,) { }


  ngOnInit() {
  }

  public onRequest(data) {
    this.loadingInProgress = data;
    this.cd.detectChanges();
  }
  public getReport(data) {
    this.productSalesReport.setData(data);
    this.headers = [];
    this.list = [];
    this.styles = [];
    if (this.productSalesReport.type === 'SUMMARY') this.classes = ['', '', '', '', 'ticket_number', 'invoice_number', 'cost', 'price', 'discount'];
    if (this.productSalesReport.type !== 'SUMMARY') this.classes = ['', '', '', 'ticket_number', 'invoice_number', 'cost', 'price', 'discount'];
    this.headers.push("Date");
    if (this.productSalesReport.type === 'SUMMARY') this.headers.push("Client");
    this.headers.push("MFG#");
    this.headers.push("Description");
    this.headers.push("Ticket number");
    this.headers.push("Invoice number");
    this.headers.push("Purchase cost");
    this.headers.push("Sale price");
    this.headers.push("Discount");
    this.productSalesReport.lines.forEach((line, index) => {
      let list = [];
      list.push(line.date);
      if (this.productSalesReport.type === 'SUMMARY') list.push(line.client);
      list.push(line.mfg);
      list.push(line.description);
      list.push(line.ticketNumber);
      list.push(line.invoiceNumber);
      list.push((line.purchaseCost) ? `$${this.parseTotal(line.purchaseCost)}` : '');

      list.push(`$${this.parseTotal(line.salePrice)}`);
      list.push(`$${this.parseTotal(line.discount)}`);
      this.list.push(list);
      this.styles.push({ 'color': !line.invoiceNumber ? 'red' : 'none' });
    })
    let list = [];
    for (let i = 0; i < ((this.productSalesReport.type === 'SUMMARY') ? 6 : 5); i++) {
      list.push("");
    }
    list.push(`$${this.parseTotal((this.productSalesReport.purchaseCostSum) ? this.productSalesReport.purchaseCostSum : 0)}`);
    list.push(`$${this.parseTotal((this.productSalesReport.salePriceSum) ? this.productSalesReport.salePriceSum : 0)}`);
    list.push(`$${this.parseTotal((this.productSalesReport.discountSum) ? this.productSalesReport.discountSum : 0)}`);
    this.list.push(list);
    this.cd.detectChanges();

  }
  onSelectedClient(client) {
    this.selectedClient = client;

  }
  perseStartDate() {
    return moment(this.productSalesReport.startDate).format('DD MMM YYYY')
  }
  perseEndDate() {
    return moment(this.productSalesReport.endDate).format('DD MMM YYYY')
  }
  parseTotal(value) {
    return parseFloat(value.toString()).toFixed(2);
  }
}
