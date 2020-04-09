import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ProductSalesReport } from '../../reports/class/product-sales-report';
import * as moment from "moment";
import { ProductCompanyReport } from '../../reports/class/product-company-report';
import { iterateListLike } from '@angular/core/src/change_detection/change_detection_util';
import { CompanyproductsFilter } from './class/company-products-filter';
import { PermissionsService } from 'src/ng2/app/services/permissions/permissions.service';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { ReportsStateService } from 'src/ng2/app/states/reports/reports-state.service';
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
  filter: CompanyproductsFilter = new CompanyproductsFilter();
  purchaseCostSum: number = 0;
  salesPriceSum: number = 0;
  constructor(private permissionsService: PermissionsService,
    private reportsStateService: ReportsStateService,
    public cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.reportsStateService.includePurchaseCost = true;
  }
  parseDate(ticketCreatedAt) {
    return moment(new Date(ticketCreatedAt)).format('DD.MM.YYYY');;
  }
  calculateSumPrices() {
    this.purchaseCostSum = 0;
    this.salesPriceSum = 0;
    this.productsCompanyReport.lines.forEach(item => {
      if (item.isChecked) {
        this.purchaseCostSum += item.purchaseCost;
        this.salesPriceSum += item.salePrice;
      }
    })

  }
  /**
   * getPermission
   */
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  public onRequest(data) {
    this.loadingInProgress = data;
    this.cd.detectChanges();
  }
  public getReport(data) {
    this.filter = new CompanyproductsFilter();
    this.productsCompanyReport.setData(data);
    this.filter.onFilterList(this.productsCompanyReport.lines);
    this.productsCompanyReport.startDate = moment(new Date(this.productsCompanyReport.startDate)).format('ll');
    this.productsCompanyReport.endDate = moment(new Date(this.productsCompanyReport.endDate)).format('ll');
    this.calculateSumPrices();
    this.cd.detectChanges();
  }
  togglePurchaseCost(data) {
    this.reportsStateService.includePurchaseCost = data;
  }
  onSelectedClient(client) {
    this.selectedClient = client;

  }
  public onFilter(field) {
    this.filter.onFilter(field, this.productsCompanyReport.lines);
    this.cd.detectChanges();
  }
  changeGeneralCheckbox() {
    if (this.generalCheckbox) {
      this.productsCompanyReport.lines.forEach(item => item.isChecked = true)
    } else {
      this.productsCompanyReport.lines.forEach(item => item.isChecked = false)
    }
    this.calculateSumPrices();
  }
  selectLine() {
    let find = this.productsCompanyReport.lines.find(item => !item.isChecked);
    this.generalCheckbox = (find) ? false : true;
    this.calculateSumPrices();
  }
  parseTotal(value) {
    return (value) ? parseFloat(value.toString()).toFixed(2) : 0;
  }
  public trackByIndex(index, item) {
    return index;
  }
}
