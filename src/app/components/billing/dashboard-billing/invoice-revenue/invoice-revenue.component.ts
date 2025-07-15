import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DashboardBillingService } from 'src/app/services/dashboard-billing/dashboard-billing.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { InvoiceRevenue } from '../class/invoice-revenue';
import * as moment from "moment";
import { MultiDatepickerDashboardComponent } from '../multi-datepicker-dashboard/multi-datepicker-dashboard.component';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';

@Component({
  selector: 'app-invoice-revenue',
  templateUrl: './invoice-revenue.component.html',
  styleUrls: ['./invoice-revenue.component.scss']
})
export class InvoiceRevenueComponent implements OnInit {
  invoiceRevenue: InvoiceRevenue = new InvoiceRevenue();
  @Input() accountingStartDate: string;
  @ViewChild('datesDp', { static: true }) datesDp: MultiDatepickerDashboardComponent;
  @ViewChild('nvd3', { static: true }) nvd3: any;
  chartColors = { domain: ["#0747a6", "#00ccff", '#cdecff'] };
  data: any;

  constructor(private companiesStateService: CompaniesStateService,
    public cd: ChangeDetectorRef,
    private permissionsService: PermissionsService,
    private dashboardBillingService: DashboardBillingService) { }

  ngOnInit() {
    this.invoiceRevenue.companyId = this.companiesStateService.getCurrentCompany().id;
    this.updateStartDate();
    this.invoiceRevenue.endDate = moment(new Date()).format('YYYY-MM-DD');
    this.datesDp.setEndDate(new Date());
    if (this.getPermissions('VIEW_ACCOUNTING')) this.getInvoiceRevenue();

  }

  public updateStartDate() {
    this.invoiceRevenue.startDate = moment(this.accountingStartDate).format('YYYY-MM-DD');
    this.datesDp.setStartDate(new Date(this.accountingStartDate));
  }
  public getInvoiceRevenue() {
    this.dashboardBillingService.getInvoiceRevenue(this.invoiceRevenue.getDataForRequest()).subscribe(data => {
      this.invoiceRevenue.setData(data);
      this.data = [
        {
          "name": "Invoiced",
          "value": this.invoiceRevenue.invoicedSum.toFixed(2)
        },
        {
          "name": "Collected",
          "value": this.invoiceRevenue.collectedSum.toFixed(2)
        },
        {
          "name": "Outstanding",
          "value": this.invoiceRevenue.outstandingSum.toFixed(2)
        }
      ];
      // this.nvd3.chart.update();
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
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
}
