import { Component, OnInit, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import * as moment from "moment";
import { Validate } from '../class/validate';
import { GlNumber } from '../class/gl-number';
import { ReportsService } from 'src/ng2/app/services/reports/reports.service';
import { GlNumberItem } from '../class/gl-number-item';
import { ReportsStateService } from 'src/ng2/app/states/reports/reports-state.service';
import { MultiDatepickerComponent } from '../../shared/multi-datepicker/multi-datepicker.component';
import { ReportValidate } from '../class/report-validate';
import { AccountsReceivable } from '../class/accounts-receivable';
import { TaxesReport } from '../class/taxes';
import { ProductService } from 'src/ng2/app/services/product/product.service';
import { ProductSalesReport } from '../class/product-sales-report';
import { CustomerSalesReport } from '../class/customer-sales-report';
import { TicketsReport } from '../class/tickets-reports';
import { TicketReportStateService } from '../reports/ticket-report/services/ticket-report-state.service';
import { ServiceReports } from '../class/service-reports';
import { ExportCSV } from '../report-additional-actions/class/export-csv';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { ProductCompanyReport } from '../class/product-company-report';


@Component({
  selector: 'app-report-menu',
  templateUrl: './report-menu.component.html',
  styleUrls: ['./report-menu.component.scss']
})
export class ReportMenuComponent implements OnInit {

  selectedClient = null;
  className = '';
  glNumber: GlNumber = new GlNumber();
  taxes: TaxesReport = new TaxesReport();
  accountsReceivable: AccountsReceivable = new AccountsReceivable();
  productSalesReport: ProductSalesReport = new ProductSalesReport();
  productsCompanyReport: ProductCompanyReport = new ProductCompanyReport();
  customerSalesReport: CustomerSalesReport = new CustomerSalesReport();
  ticketsReport: TicketsReport = new TicketsReport();
  serviceReport: ServiceReports = new ServiceReports();
  loadingInProgress: boolean = true;
  listDetailed = ['Year to date', 'Monthly'];
  listTypes = ['Summary', 'Detailed'];
  yearToDate = false;
  validate: ReportValidate = new ReportValidate();
  public productList = [];
  isDisabledCompany: boolean = false;
  @Input() report = "";
  @Output() getReport = new EventEmitter<any>();
  @Output() onRequest = new EventEmitter<any>();
  @Output() onSelectedClient = new EventEmitter<any>();
  @ViewChild('dp') datePicker: any;
  @ViewChild('cp') companiesList: any;
  constructor(private reportsService: ReportsService,
    private reportsStateService: ReportsStateService,
    private productService: ProductService,
    private companiesStateService:CompaniesStateService,
    private ticketReportStateService: TicketReportStateService) { }

  ngOnInit() {
    if (this.report === 'accounts-receivable') this.getReportByAccountsReceivable();
    if (this.report === 'byProducts' || this.report === 'company-roducts-report') {
      this.isDisabledCompany = true;
      this.getItemListProducts();
    }
    if (this.report === 'byCustomers') this.isDisabledCompany = true;

  }
  public onSelectDetailed(data) {
    this.yearToDate = false;
    if (data === 'Monthly') {
      this.datePicker.clearDate();
      this.glNumber.setMonthlyDetailed(true);
      this.datePicker.setDisabled(true);

    } else {
      if (data === 'Year to date') {
        console.log("fffff");
        this.datePicker.clearDate();
        this.datePicker.setDisabled(true);

        this.yearToDate = true;
      } else {
        this.datePicker.setDisabled(false);
      }
      this.glNumber.setMonthlyDetailed(false);
    }
    this.glNumber.resetDates();
    this.validate.resetDates();
    this.validate.resetMonthlyDetailed();

    //this.reportsStateService.onChangeGlNumber(this.glNumber);
  }
  public onSelectTypeTaxes(data) {
    this.taxes.setType(data);
  }
  public onSelectTypeCustomers(data) {
    this.customerSalesReport.setType(data);
    this.isDisabledCompany = (data === 'Summary') ? true : false;
    if (data === 'Summary') this.validate.resetCompany();
  }
  public onSelectTypeProduct(data) {
    this.productSalesReport.setType(data);
    this.isDisabledCompany = (data === 'Summary') ? true : false;
    if (data === 'Summary') this.validate.resetCompany();
  }
  public selectClient(selectClient) {
    console.log("companiesList", this.companiesList);
    // this.companiesList.setDisabled(true);
    if (selectClient === 'null') {

      //  this.recurringState.getCreateTicket().setCompany(null);
      this.accountsReceivable.setClientCompanyId(null);
      this.selectedClient = null;
      this.glNumber.setClientCompanyId(null);
      this.productSalesReport.setCompanyId(null);
      this.customerSalesReport.setCompanyId(null);
      this.serviceReport.setCompanyId(null);
      this.ticketsReport.setCompanyId(null);
      //  this.recurringState.setClient(selectClient);

    } else {
      // this.recurringState.getCreateTicket().setCompany(selectClient.item.id);
      this.selectedClient = selectClient.item;
      this.glNumber.setClientCompanyId(selectClient.item.id);
      this.accountsReceivable.setClientCompanyId(selectClient.item.id);
      this.productSalesReport.setCompanyId(selectClient.item.id);
      this.customerSalesReport.setCompanyId(selectClient.item.id);
      this.ticketsReport.setCompanyId(selectClient.item.id);
      this.serviceReport.setCompanyId(selectClient.item.id);
      if (this.ticketsReport.startDate === '' && this.ticketsReport.endDate === '') this.ticketsReport.setDatesByCompany(this.selectedClient);
      if (this.serviceReport.startDate === '' && this.serviceReport.endDate === '') this.serviceReport.setDatesByCompany(this.selectedClient);

      this.validate.resetCompany();
      //  this.recurringState.setClient(selectClient);
      //  this.onCheckListServices();
      //  this.getCompanyDevices();

    }

    console.log("this.selectClient", this.selectedClient);
    this.onSelectedClient.emit(this.selectedClient);
    //  this.services = [new ForCreateService()];
    // this.cd.detectChanges();
    // this.reportsStateService.onChangeGlNumber(this.glNumber);

  }
  toggleShowResponseTime(event) {
    console.log("event", event.target.checked);
    this.ticketReportStateService.toggleShowResponseTime(event.target.checked);
  }
  toggleShowDashboard(event) {
    console.log("event", event.target.checked);
    this.ticketReportStateService.toggleShowDashboard(event.target.checked);
  }
  toggleShowServices(event) {
    console.log("event", event.target.checked);
    this.ticketReportStateService.toggleShowServices(event.target.checked);
  }
  toggleShowProducts(event) {
    console.log("event", event.target.checked);
    this.ticketReportStateService.toggleShowProducts(event.target.checked);
  }
  onSelectTechUser(data) {
    this.ticketsReport.setTechUser(data);
  }
  getReportByTaxes() {
    if (!this.validate.isValidateTaxes(this.glNumber.startDate, this.glNumber.endDate)) return;

    this.onRequest.emit(true);
    this.reportsService.getReportByTaxes(this.taxes.getForRequest()).subscribe(data => this.setDatareport(data));
    this.reportsStateService.onChangeExportCSV(new ExportCSV('reports/sales/byTaxes', this.taxes.getForRequest(), 'Sales_report_by_customer'));
  }
  getReportByAccountsReceivable() {
    this.onRequest.emit(true);
    this.reportsService.getReportByAccountsReceivable(this.accountsReceivable.getForRequest()).subscribe(data => this.setDatareport(data));
    this.reportsStateService.onChangeExportCSV(new ExportCSV('reports/sales/byReceivable', this.taxes.getForRequest(), 'Sales_report_by_receivable'));
  }
  getReportByService() {
    if (!this.validate.isValidateService(this.selectedClient)) return;

    this.onRequest.emit(true);
    this.reportsService.getReportByService(this.serviceReport.getForRequest()).subscribe(data => this.setDatareport(data));
  }
  getReportByTickets() {
    if (!this.validate.isValidateTickets(this.selectedClient)) return;

    this.onRequest.emit(true);
    this.reportsService.getReportByTickets(this.ticketsReport.getForRequest()).subscribe(data => this.setDatareport(data));

  }
  getReportByCustomers() {
    if (!this.validate.isValidateCustomers(this.customerSalesReport.startDate, this.customerSalesReport.endDate, (this.selectedClient) ? this.selectedClient.id : null, this.customerSalesReport.type)) return;

    this.onRequest.emit(true);
    this.reportsService.getReportByCustomers(this.customerSalesReport.getForRequest()).subscribe(data => this.setDatareport(data));
    this.reportsStateService.onChangeExportCSV(new ExportCSV('reports/sales/byCustomers', this.productSalesReport.getForRequest(), 'Sales_report_by_customer'));
  }
  getReportCompanyProducts() {
    // if (!this.validate.isValidateProduct(this.productSalesReport.startDate, this.productSalesReport.endDate, this.productSalesReport.companyId, this.productSalesReport.type)) return;
    
    this.productsCompanyReport.setCompanyId(localStorage.getItem('company_id') || null);
    
    this.selectedClient = this.companiesStateService.getCompanies().find(item => item.id === this.productsCompanyReport.companyId);
    if (this.productsCompanyReport.startDate === '' && this.productsCompanyReport.endDate === '') this.productsCompanyReport.setDatesByCompany(this.selectedClient);
    this.onSelectedClient.emit(this.selectedClient);
    this.productsCompanyReport.setType('Detailed');
    this.onRequest.emit(true);
    this.reportsService.getReportByProduct(this.productsCompanyReport.getForRequest()).subscribe(data => this.setDatareport(data));
    this.reportsStateService.onChangeExportCSV(new ExportCSV('reports/sales/byProducts', this.productsCompanyReport.getForRequest(), 'Sales_report_by_products'));

  }
  getReportByProducts() {
    if (!this.validate.isValidateProduct(this.productSalesReport.startDate, this.productSalesReport.endDate, this.productSalesReport.companyId, this.productSalesReport.type)) return;

    this.onRequest.emit(true);
    this.reportsService.getReportByProduct(this.productSalesReport.getForRequest()).subscribe(data => this.setDatareport(data));
    this.reportsStateService.onChangeExportCSV(new ExportCSV('reports/sales/byProducts', this.productSalesReport.getForRequest(), 'Sales_report_by_products'));

  }
  getReportByGlNumber() {

    if (!this.validate.isValidate(this.glNumber.monthlyDetailed, this.yearToDate, this.glNumber.startDate, this.glNumber.endDate)) return;

    this.onRequest.emit(true);

    if (this.yearToDate) {
      this.reportsService.getAccountingStartDate().subscribe((res: any) => {
        console.log("res", res.accountingStartDate);
        this.glNumber.setStartDate(moment(res.accountingStartDate).format('YYYY/MM/DD'));
        this.glNumber.setEndDate(moment(new Date()).format('YYYY/MM/DD'));
        this.reportsService.getReportByGlNumber(this.glNumber.getForRequest()).subscribe(data => this.setDatareport(data));
      })
    } else {
      if (this.glNumber.getMonthlyDetailed()) this.glNumber.setDatesForMonthly();
      this.reportsService.getReportByGlNumber(this.glNumber.getForRequest()).subscribe(data => this.setDatareport(data));
    }


  }
  private setDatareport(data) {

    if (this.report === 'income-accounts') {
      this.glNumber.setResponse(data);
      this.reportsStateService.onChangeGlNumber(this.glNumber);
    }
    if (this.report === 'service-report') {
      this.serviceReport.setData(data);
      this.reportsStateService.onChangeServiceReport(this.serviceReport.getDataObject());
    }


    this.getReport.emit(data);
    this.loadingInProgress = false;
    this.onRequest.emit(false);
  }
  public trackByIndex(index, item) {
    return index;
  }
  /**
  * filter data by date
  */
  public filterByDate(value) {
    if (value.start !== '' && value.end !== '') {

      this.glNumber.setStartDate(moment(value.start).format('YYYY/MM/DD'));
      this.glNumber.setEndDate(moment(value.end).format('YYYY/MM/DD'));

      

      this.productsCompanyReport.setStartDate(moment(value.start).format('YYYY/MM/DD'));
      this.productsCompanyReport.setEndDate(moment(value.end).format('YYYY/MM/DD'));

      this.productSalesReport.setStartDate(moment(value.start).format('YYYY/MM/DD'));
      this.productSalesReport.setEndDate(moment(value.end).format('YYYY/MM/DD'));

      this.customerSalesReport.setStartDate(moment(value.start).format('YYYY/MM/DD'));
      this.customerSalesReport.setEndDate(moment(value.end).format('YYYY/MM/DD'));

      this.taxes.setStartDate(moment(value.start).format('YYYY/MM/DD'));
      this.taxes.setEndDate(moment(value.end).format('YYYY/MM/DD'));

      this.ticketsReport.setStartDate(moment(value.start).format('YYYY/MM/DD'));
      this.ticketsReport.setEndDate(moment(value.end).format('YYYY/MM/DD'));

      this.serviceReport.setStartDate(moment(value.start).format('YYYY/MM/DD'));
      this.serviceReport.setEndDate(moment(value.end).format('YYYY/MM/DD'));
      this.validate.resetDates();
      this.validate.resetMonthlyDetailed();
    } else {
      this.glNumber.resetDates();
      this.productSalesReport.resetDates();
      this.productsCompanyReport.resetDates();
      
      if (this.selectedClient) {
        this.ticketsReport.setDatesByCompany(this.selectedClient);
        this.serviceReport.setDatesByCompany(this.selectedClient);
      }

    }

    //  this.reportsStateService.onChangeGlNumber(this.glNumber);
  }

  /**
 * Get product list
 */
  public getItemListProducts() {
    this.productService.getCategories().subscribe((res: any) => {
      this.productList = res;

    });
  }

  /**
  * Set product item
  * @param item - product
  */
  public selectProduct(item) {
    console.log("item", item);
    this.productSalesReport.setProductId((item) ? item.versionedId.id : null);
    this.productsCompanyReport.setProductId((item) ? item.versionedId.id : null);

  }

  public onChangeTehUsers(tehusers) {
    console.log("tehusers", tehusers);

  }
}
