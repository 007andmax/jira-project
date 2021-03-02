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
import { TechService } from '../class/tech-service';
import { AccountingReport } from '../class/accounting-report';
import { DetailedCommissionsReport } from '../class/detailed-commissions-report';
import { CommonCommissionsReport } from '../class/common-commissions-report';
import { DevicesStateService } from 'src/ng2/app/states/devices/devices-state.service';
import { SoftwareSummaryReport } from '../class/software-summary-report';
import { DevicesService } from 'src/ng2/app/services/devices/devices.service';
import { HardwareSummaryReport } from '../class/hardware-summary-report';


@Component({
  selector: 'app-report-menu',
  templateUrl: './report-menu.component.html',
  styleUrls: ['./report-menu.component.scss']
})
export class ReportMenuComponent implements OnInit {

  selectedClient = null;
  className = '';
  techService: TechService = new TechService();
  glNumber: GlNumber = new GlNumber();
  taxes: TaxesReport = new TaxesReport();
  accountingReport: AccountingReport = new AccountingReport();
  accountsReceivable: AccountsReceivable = new AccountsReceivable();
  productSalesReport: ProductSalesReport = new ProductSalesReport();
  productsCompanyReport: ProductCompanyReport = new ProductCompanyReport();
  customerSalesReport: CustomerSalesReport = new CustomerSalesReport();
  detailedCommissionsReport: DetailedCommissionsReport = new DetailedCommissionsReport();
  commonCommissionsReport: CommonCommissionsReport = new CommonCommissionsReport();
  softwareSummaryReport: SoftwareSummaryReport = new SoftwareSummaryReport();
  ticketsReport: TicketsReport = new TicketsReport();
  serviceReport: ServiceReports = new ServiceReports();
  hardwareSummaryReport: HardwareSummaryReport = new HardwareSummaryReport();
  loadingInProgress: boolean = true;
  listDetailed = ['Year to date', 'Monthly'];
  listTypes = ['Summary', 'Detailed'];
  yearToDate = false;
  validate: ReportValidate = new ReportValidate();
  isDisabledCompany: boolean = false;
  allDevices = [];
  devices = [];
  companies = [];
  @Input() report = "";
  @Output() getReport = new EventEmitter<any>();
  @Output() onRequest = new EventEmitter<any>();
  @Output() onSelectedClient = new EventEmitter<any>();
  @ViewChild('dp') datePicker: any;
  @ViewChild('cp') companiesList: any;
  constructor(private reportsService: ReportsService,
    private reportsStateService: ReportsStateService,
    private productService: ProductService,
    private devicesStateService: DevicesStateService,
    private devicesService: DevicesService,
    private companiesStateService: CompaniesStateService,
    private ticketReportStateService: TicketReportStateService) { }

  ngOnInit() {
    if (this.report === 'accounts-receivable') this.getReportByAccountsReceivable();
    if (this.report === 'byProducts' || this.report === 'company-roducts-report') {
      this.isDisabledCompany = true;
    }
    if (this.report === 'byCustomers') this.isDisabledCompany = true;
    if (this.devicesStateService.getAllDevices()) this.allDevices = this.devicesStateService.getAllDevices();
    let getOnDevices = this.devicesStateService.getOnDevices().subscribe((data) => {
      this.allDevices = data;
    })
    //  this.sub.add(getOnDevices);
    if (this.companiesStateService.getCompanies().length > 0) this.getClientsList(this.companiesStateService.getCompanies());
    let getOnCompanies = this.companiesStateService.getOnCompanies().subscribe((data) => {
      this.getClientsList(data);
    })
    //  this.sub.add(getOnCompanies);
  }
  getClientsList(data) {
    this.companies = data.filter(item => item.accountType === 'CLIENT' && !item.deletedAt).sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
      1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
  }
  public getDevicesByCompany(companyId) {
    this.devices = (this.devicesStateService.getAllDevices()[companyId]) ? this.devicesStateService.getAllDevices()[companyId] : [];

  }

  public getSoftByCompany(companyId) {
    this.softwareSummaryReport.setPreloaderSoft(true);

    this.hardwareSummaryReport.setPreloaderDevices(true);
    this.devicesService.getSoft(companyId).subscribe((resp: any) => {
      // $rootScope.softwareSummarySelectedCompany = resp;

      this.softwareSummaryReport.resetSoft();

      if (resp) {
        resp[companyId].map((item: any) => {
          if (item.report) {
            item.report.softList.map((item) => {
              item.softName && this.softwareSummaryReport.addSoft({ name: item.softName, type: 'soft' });
              item.softPublisher && this.softwareSummaryReport.addSoft({ name: item.softPublisher, type: 'publisher' });
            });
          }
        });
        var obj = {};
        for (var i = 0, len = this.softwareSummaryReport.soft.length; i < len; i++) {
          obj[this.softwareSummaryReport.soft[i]['name']] = this.softwareSummaryReport.soft[i];
        }
        this.softwareSummaryReport.resetSoft();
        for (var key in obj) {
          this.softwareSummaryReport.addSoft(obj[key]);
          /* this.softwareSummaryReport.soft.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
             1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));*/
        }
        this.softwareSummaryReport.setDevices(resp[companyId]);
        console.log("resp[companyId]", resp[companyId]);
        this.hardwareSummaryReport.setDevices(resp[companyId]);
      }
      this.softwareSummaryReport.setPreloaderSoft(false);

      this.hardwareSummaryReport.setPreloaderDevices(false);
    }, err => {
      this.softwareSummaryReport.resetSoft();
      this.softwareSummaryReport.setPreloaderSoft(false);

      this.hardwareSummaryReport.setPreloaderDevices(false);
    })
  }
  public onSelectDetailed(data) {
    this.yearToDate = false;
    if (data === 'Monthly') {
      this.datePicker.clearDate();
      this.glNumber.setMonthlyDetailed(true);
      this.datePicker.setDisabled(true);

    } else {
      if (data === 'Year to date') {
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
  }
  public onSelectDevice(data) {
    this.softwareSummaryReport.setDeviceId((data) ? data.id : null);
    this.hardwareSummaryReport.setDeviceId((data) ? data.id : null);
  }
  public onSelectSoftware(data) {
    this.softwareSummaryReport.setSoftwareSoft(data);
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
    console.log("selectClient", selectClient);
    if (selectClient == null) {
      this.accountsReceivable.setClientCompanyId(null);
      this.selectedClient = null;
      this.glNumber.setClientCompanyId(null);
      this.productSalesReport.setCompanyId(null);
      this.customerSalesReport.setCompanyId(null);
      this.serviceReport.setCompanyId(null);
      this.ticketsReport.setCompanyId(null);
      this.accountingReport.setCompanyId(null);
      this.detailedCommissionsReport.setCompanyId(null);
      this.commonCommissionsReport.setCompanyId(null);
      this.softwareSummaryReport.setCompanyId(null);
      this.hardwareSummaryReport.setCompanyId(null);

      this.getDevicesByCompany(null);
      this.softwareSummaryReport.resetSoft();
    } else {
      this.selectedClient = selectClient;
      this.accountingReport.setCompanyId(selectClient.id);
      this.glNumber.setClientCompanyId(selectClient.id);
      this.accountsReceivable.setClientCompanyId(selectClient.id);
      this.productSalesReport.setCompanyId(selectClient.id);
      this.customerSalesReport.setCompanyId(selectClient.id);
      this.ticketsReport.setCompanyId(selectClient.id);
      this.serviceReport.setCompanyId(selectClient.id);
      this.detailedCommissionsReport.setCompanyId(selectClient.id);
      this.commonCommissionsReport.setCompanyId(selectClient.id);
      this.softwareSummaryReport.setCompanyId(selectClient.id);
      this.hardwareSummaryReport.setCompanyId(selectClient.id);
      this.getDevicesByCompany(selectClient.id);
      this.getSoftByCompany(selectClient.id);
      if (this.ticketsReport.startDate === '' && this.ticketsReport.endDate === '') this.ticketsReport.setDatesByCompany(this.selectedClient);
      if (this.serviceReport.startDate === '' && this.serviceReport.endDate === '') this.serviceReport.setDatesByCompany(this.selectedClient);
      this.validate.resetCompany();
    }
    this.onSelectedClient.emit(this.selectedClient);
  }
  toggleDetailsByProducts(data) {
    this.detailedCommissionsReport.setDetailsByProducts(data);
    this.commonCommissionsReport.setDetailsByProducts(data);
  }
  toggleShowResponseTime(event) {
    this.ticketReportStateService.toggleShowResponseTime(event.target.checked);
  }
  toggleShowDashboard(event) {
    this.ticketReportStateService.toggleShowDashboard(event.target.checked);
  }
  toggleShowServices(event) {
    this.ticketReportStateService.toggleShowServices(event.target.checked);
  }
  toggleShowProducts(event) {
    this.ticketReportStateService.toggleShowProducts(event.target.checked);
  }
  onSelectTechUser(data) {
    this.ticketsReport.setTechUser(data);
    this.techService.setTechUserId((data) ? data.id : null);
    this.detailedCommissionsReport.setTechUserId((data) ? data.id : null);
    this.commonCommissionsReport.setTechUserId((data) ? data.id : null);
    if (data) this.validate.resetTechUser();
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
    this.reportsService.getReportByService(this.serviceReport.getForRequest()).subscribe((data: any) => {

      this.setDatareport(data)
    });
  }
  getReportByHardwareSummary() {
    if (!this.validate.isValidateHardwareSummary(this.hardwareSummaryReport.companyId)) return;
    this.onRequest.emit(true);
    console.log("this.hardwareSummaryReport", this.hardwareSummaryReport);
    this.setDatareport(this.hardwareSummaryReport)
  }
  getReportBySoftwareSummary() {
    if (!this.validate.isValidateSoftwareSummary(this.softwareSummaryReport.companyId)) return;

    console.log("this.softwareSummaryReport", this.softwareSummaryReport);
    this.setDatareport(this.softwareSummaryReport)

  }
  getReportByAccounting() {
    if (!this.validate.isValidateAccounting(this.accountingReport.startDate, this.accountingReport.endDate, this.selectedClient)) return;
    this.onRequest.emit(true);
    this.reportsService.getReportByAccounting(this.accountingReport.getForRequest()).subscribe((data: any) => {
      this.accountingReport.setDataFromRequest(data);
      this.setDatareport(this.accountingReport)
    });

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
        this.glNumber.setStartDate(moment(res.accountingStartDate).format('YYYY/MM/DD'));
        this.glNumber.setEndDate(moment(new Date()).format('YYYY/MM/DD'));
        this.reportsService.getReportByGlNumber(this.glNumber.getForRequest()).subscribe(data => this.setDatareport(data));
      })
    } else {
      if (this.glNumber.getMonthlyDetailed()) this.glNumber.setDatesForMonthly();
      this.reportsService.getReportByGlNumber(this.glNumber.getForRequest()).subscribe(data => this.setDatareport(data));
    }


  }

  getReportByTechService() {

    if (!this.validate.isValidateTechService(this.techService.startDate, this.glNumber.endDate)) return;

    this.onRequest.emit(true);



    this.reportsService.getReportByTechService(this.techService.getForRequest()).subscribe((data: any) => {
      this.techService.setList(data.lines);
      this.techService.setTotalQuantity(data.totalQuantity);
      this.setDatareport(this.techService)
    });


  }
  getReportDetailedCommissions() {
    if (!this.validate.isValidateDetailedCommissions(this.detailedCommissionsReport.userId)) return;

    this.onRequest.emit(true);

    if (!this.detailedCommissionsReport.startDate && !this.detailedCommissionsReport.endDate) {
      this.detailedCommissionsReport.setStartDate(moment(this.companiesStateService.getCurrentCompany().createdAt).format('YYYY/MM/DD'))
      this.detailedCommissionsReport.setEndDate(moment(new Date()).format('YYYY/MM/DD'))

    }

    this.reportsService.getReportDetailedCommissions(this.detailedCommissionsReport.getForRequest()).subscribe((data: any) => {
      this.detailedCommissionsReport.setData(data);
      this.setDatareport(this.detailedCommissionsReport)
    });

  }
  getReportCommonCommissions() {
    if (!this.validate.isValidateCommonCommissions(this.commonCommissionsReport.userId)) return;

    this.onRequest.emit(true);

    if (!this.commonCommissionsReport.startDate && !this.commonCommissionsReport.endDate) {
      this.commonCommissionsReport.setStartDate(moment(this.companiesStateService.getCurrentCompany().createdAt).format('YYYY/MM/DD'))
      this.commonCommissionsReport.setEndDate(moment(new Date()).format('YYYY/MM/DD'))

    }

    this.reportsService.getReportDetailedCommissions(this.commonCommissionsReport.getForRequest()).subscribe((data: any) => {
      this.commonCommissionsReport.setData(data);
      this.setDatareport(this.commonCommissionsReport)
    });

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

      this.techService.setStartDate(moment(value.start).format('YYYY-MM-DD'));
      this.techService.setEndDate(moment(value.end).format('YYYY-MM-DD'));


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

      this.accountingReport.setStartDate(moment(value.start).format('YYYY-MM-DD'));
      this.accountingReport.setEndDate(moment(value.end).format('YYYY-MM-DD'));

      this.detailedCommissionsReport.setStartDate(moment(value.start).format('YYYY/MM/DD'));
      this.detailedCommissionsReport.setEndDate(moment(value.end).format('YYYY/MM/DD'));
      this.commonCommissionsReport.setStartDate(moment(value.start).format('YYYY/MM/DD'));
      this.commonCommissionsReport.setEndDate(moment(value.end).format('YYYY/MM/DD'));


      this.validate.resetDates();
      this.validate.resetMonthlyDetailed();
    } else {
      this.accountingReport.resetDates();
      this.glNumber.resetDates();
      this.productSalesReport.resetDates();
      this.productsCompanyReport.resetDates();
      this.techService.resetDates();

      this.detailedCommissionsReport.resetDates();
      this.commonCommissionsReport.resetDates();
      if (this.selectedClient) {
        this.ticketsReport.setDatesByCompany(this.selectedClient);
        this.serviceReport.setDatesByCompany(this.selectedClient);
      }
    }
  }

  /**
  * Set product item
  * @param item - product
  */
  public selectProduct(item) {
    this.productSalesReport.setProductId((item) ? item.versionedId.id : null);
    this.productsCompanyReport.setProductId((item) ? item.versionedId.id : null);

  }

  public onChangeTehUsers(tehusers) {

  }
}
