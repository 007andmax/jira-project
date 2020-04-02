import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ProductSalesReport } from '../../class/product-sales-report';
import { ReportsStateService } from 'src/ng2/app/states/reports/reports-state.service';
import * as moment from "moment";
@Component({
  selector: 'app-product-sales-report',
  templateUrl: './product-sales-report.component.html',
  styleUrls: ['./product-sales-report.component.scss']
})
export class ProductSalesReportComponent implements OnInit {
  productSalesReport: ProductSalesReport = new ProductSalesReport();
  headers = [];
  list = [];
  styles = [];
  classes = [];
  selectedClient = null;
  loadingInProgress: boolean = false;
  constructor(private reportsStateService: ReportsStateService, public cd: ChangeDetectorRef, ) { }


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
    this.classes = [];
    this.headers.push("Date");
    if (this.productSalesReport.type === 'SUMMARY') this.headers.push("Client");
    this.headers.push("MFG#");
    this.headers.push("Description");
    this.headers.push("Ticket number");
    this.headers.push("Invoice number");
    this.headers.push("Purchase cost");
    this.headers.push("Sale price");
    this.headers.push("Discount(amount)");


    this.classes.push("col-md-1");
    if (this.productSalesReport.type === 'SUMMARY') this.classes.push("col-md-1");
    this.classes.push("col-md-1");
    if (this.productSalesReport.type === 'SUMMARY') {
      this.classes.push("col-md-3");
    }  else {
      this.classes.push("col-md-4");
    }
    this.classes.push("col-md-2");
    this.classes.push("col-md-2");
    this.classes.push("col-md-2");
    this.classes.push("col-md-1");
    this.classes.push("col-md-1");

    this.productSalesReport.lines.forEach((line,index) => {
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
      if (index === this.productSalesReport.lines.length - 2) {
        this.styles.push({'color': line.salePrice < line.purchaseCost ? 'red' : 'none'});
      } else if (index === this.productSalesReport.lines.length - 1) {
        this.styles.push({'color': 'red'});
      } else {
        this.styles.push({'color':!line.invoiceNumber ? 'red' : 'none'});
      } 
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
