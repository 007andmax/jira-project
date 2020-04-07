import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ProductSalesReport } from '../../reports/class/product-sales-report';
import * as moment from "moment";
import { ProductCompanyReport } from '../../reports/class/product-company-report';
import { iterateListLike } from '@angular/core/src/change_detection/change_detection_util';
import { CompanyproductsFilter } from './class/company-products-filter';
@Component({
  selector: 'company-products',
  templateUrl: './company-products.component.html',
  styleUrls: ['./company-products.component.scss']
})
export class CompanyProductsComponent implements OnInit {
  productsCompanyReport: ProductCompanyReport = new ProductCompanyReport();
  selectedClient = null;
  loadingInProgress: boolean = false;
  generalCheckbox: boolean = true;
  filter:CompanyproductsFilter = new CompanyproductsFilter();
  constructor(public cd: ChangeDetectorRef) { }

  ngOnInit() {
    console.log("ngOnInit");
  }
  parseDate(ticketCreatedAt) {
    return moment(new Date(ticketCreatedAt)).format('DD.MM.YYYY');;
  }

  public onRequest(data) {
    this.loadingInProgress = data;
    this.cd.detectChanges();
  }
  public getReport(data) {
    this.filter = new CompanyproductsFilter();
    this.productsCompanyReport.setData(data);
    console.log("this.productsCompanyReport", this.productsCompanyReport);
    this.cd.detectChanges();
  }
  onSelectedClient(client) {
    this.selectedClient = client;

  }
  public onFilter(field) {
    this.filter.onFilter(field, this.productsCompanyReport.lines)
    this.cd.detectChanges();
  }
  changeGeneralCheckbox() {
    console.log("this.generalCheckbox", this.generalCheckbox);
    if (this.generalCheckbox) {
      this.productsCompanyReport.lines.forEach(item => item.isChecked = true)
    } else {
      this.productsCompanyReport.lines.forEach(item => item.isChecked = false)
    }
  }
  selectLine() {
    let find = this.productsCompanyReport.lines.find(item => !item.isChecked);
    this.generalCheckbox = (find) ? false : true;
  }
  parseTotal(value) {
    return (value) ? parseFloat(value.toString()).toFixed(2) : 0;
  }
  public trackByIndex(index, item) {
    return index;
  }
}
