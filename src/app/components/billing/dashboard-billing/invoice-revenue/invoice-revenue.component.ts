import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DashboardBillingService } from 'src/app/services/dashboard-billing/dashboard-billing.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { InvoiceRevenue } from '../class/invoice-revenue';
import * as moment from "moment";
import { ReportsService } from 'src/app/services/reports/reports.service';
import { MultiDatepickerDashboardComponent } from '../multi-datepicker-dashboard/multi-datepicker-dashboard.component';

@Component({
  selector: 'app-invoice-revenue',
  templateUrl: './invoice-revenue.component.html',
  styleUrls: ['./invoice-revenue.component.scss']
})
export class InvoiceRevenueComponent implements OnInit {
  invoiceRevenue: InvoiceRevenue = new InvoiceRevenue();
  @Input() accountingStartDate: string;
  @ViewChild('datesDp') datesDp: MultiDatepickerDashboardComponent;
  @ViewChild('nvd3') nvd3: any;
  chartOptions: any;
  chartColors = ["#0747a6", "#00ccff", "#cdecff"];
  data: any;

  constructor(private companiesStateService: CompaniesStateService,
    private reportsService: ReportsService,
    public cd: ChangeDetectorRef,
    private dashboardBillingService: DashboardBillingService) { }

  ngOnInit() {
    this.chartOptions = {
      chart: {
        type: 'pieChart',
        height: 180,
        width: 180,
        margin: {
          top: -5,
          right: -5,
          bottom: -5,
          left: -5
        },
        donut: true,
        x: (d: any) => { return d.label; },
        y: (d: any) => { return d.value; },
        showLabels: false,
        color: (d: any, i: any) => {
          return this.chartColors[i]
        },
        showLegend: false,
        duration: 500,

        donutRatio: '0.68'
      }
    }
    this.data = [
      {
        "label": "Invoiced",
        "value": 8
      },
      {
        "label": "Collected",
        "value": 32
      },
      {
        "label": "Outstanding",
        "value": 60
      }
    ];
    this.invoiceRevenue.companyId = this.companiesStateService.getCurrentCompany().id;
    this.updateStartDate();
    this.invoiceRevenue.endDate = moment(new Date()).format('YYYY-MM-DD');
    this.datesDp.setEndDate(new Date());
    this.getInvoiceRevenue();

  }
  public updateStartDate() {
    this.invoiceRevenue.startDate = moment(this.accountingStartDate).format('YYYY-MM-DD');
    this.datesDp.setStartDate(new Date(this.accountingStartDate));
  }
  public getInvoiceRevenue() {
    this.dashboardBillingService.getInvoiceRevenue(this.invoiceRevenue.getDataForRequest()).subscribe(data => {
      this.invoiceRevenue.setData(data);
      this.data[0].value = this.invoiceRevenue.invoicedSum;
      this.data[1].value = this.invoiceRevenue.collectedSum;
      this.data[2].value = this.invoiceRevenue.outstandingSum;
      this.nvd3.chart.update();
      this.cd.detectChanges();
    })
  }

  public filterByDate(value) {
    if (value.start !== '' && value.end !== '') {

      this.invoiceRevenue.startDate = moment(value.start).format('YYYY-MM-DD');
      this.invoiceRevenue.endDate = moment(value.end).format('YYYY-MM-DD');

    } else {
      this.invoiceRevenue.endDate = moment(new Date()).format('YYYY-MM-DD');
      this.datesDp.setEndDate(new Date());
      this.updateStartDate();
    }
    this.cd.detectChanges();
    this.getInvoiceRevenue();

  }

}
