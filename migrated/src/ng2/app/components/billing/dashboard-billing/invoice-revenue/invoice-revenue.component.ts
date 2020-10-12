import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DashboardBillingService } from 'src/ng2/app/services/dashboard-billing/dashboard-billing.service';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { InvoiceRevenue } from '../class/invoice-revenue';
import * as moment from "moment";
import { ReportsService } from 'src/ng2/app/services/reports/reports.service';
import { MultiDatepickerDashboardComponent } from '../multi-datepicker-dashboard/multi-datepicker-dashboard.component';

@Component({
  selector: 'app-invoice-revenue',
  templateUrl: './invoice-revenue.component.html',
  styleUrls: ['./invoice-revenue.component.scss']
})
export class InvoiceRevenueComponent implements OnInit {
  invoiceRevenue: InvoiceRevenue = new InvoiceRevenue();
  @Input() accountingStartDate:string;
  @ViewChild('datesDp') datesDp: MultiDatepickerDashboardComponent;
  @ViewChild('nvd3') nvd3:any;
  chartOptions: any;
  chartColors = ["#0646a4", "#00ccff", '#2bc7c6'];
  data: any;
   
  constructor(private companiesStateService: CompaniesStateService,
    private reportsService: ReportsService,
    public cd: ChangeDetectorRef,
    private dashboardBillingService: DashboardBillingService) { }

  ngOnInit() {
    this.chartOptions = {
      chart: {
        type: 'pieChart',
        height: 200,
        donut: true,
        x: (d: any) => { return d.label; },
        y: (d: any) => { return d.value; },
        showLabels: false,
        color: (d: any, i: any) => {
          return this.chartColors[i]
        },
        showLegend: false,
        duration: 500,
        legend: {
          margin: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          }
        },
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
    
      this.invoiceRevenue.startDate = moment(this.accountingStartDate).format('YYYY-MM-DD');
      this.invoiceRevenue.endDate = moment(new Date()).format('YYYY-MM-DD');
      this.datesDp.setStartDate(new Date(this.accountingStartDate));
      this.datesDp.setEndDate(new Date());
      this.getInvoiceRevenue();
    
  }
  getInvoiceRevenue() {
    this.dashboardBillingService.getInvoiceRevenue(this.invoiceRevenue.getDataForRequest()).subscribe(data => {
      console.log("data", data);
      this.invoiceRevenue.setData(data);
      this.data[0].value = this.invoiceRevenue.invoicedSum;
      this.data[1].value = this.invoiceRevenue.collectedSum;
      this.data[2].value = this.invoiceRevenue.outstandingSum;
      console.log("chart",this.nvd3);
      this.nvd3.chart.update();
      this.cd.detectChanges();
    })
  }

  public filterByDate(value) {
    console.log("value", value);
    this.invoiceRevenue.startDate = moment(value.start).format('YYYY-MM-DD');
    this.invoiceRevenue.endDate = moment(value.end).format('YYYY-MM-DD');
    this.getInvoiceRevenue();

  }

}
