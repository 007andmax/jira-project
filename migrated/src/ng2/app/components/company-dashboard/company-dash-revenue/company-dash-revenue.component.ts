import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CompaniesService } from 'src/ng2/app/services/company/companies.service';
import * as moment from "moment";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-company-dash-revenue',
  templateUrl: './company-dash-revenue.component.html',
  styleUrls: ['./company-dash-revenue.component.scss']
})
export class CompanyDashRevenueComponent implements OnInit {

  _id:string = '';
  month:string = '12';
  totalRevenue:string = '';
  invoicedSum:number = 0;
  collectedSum:number = 0;
  outstandingSum:number = 0;
  data: any;
  sub: Subscription = new Subscription();
  chartOptions: any;
  chartColors:string[] = ["#0747a6", "#00ccff", '#cdecff'];

  public constructor(private companiesService: CompaniesService,
    public cd: ChangeDetectorRef) { }

  public ngOnInit() {
    this._id = /[^/]*$/.exec(window.location.href)[0];
    this.getInvoiceRevenue('12');
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
    this.data = [];
  }

  getInvoiceRevenue(month) {
    let obj: InvoiceRevenue = {
      startDate: moment(new Date()).subtract(month, 'months').format('YYYY-MM-DD'),
      endDate: moment(new Date()).format('YYYY-MM-DD'),
      id: this._id
    };
    let getRevenue = this.companiesService.getInvoiceRevenue(obj).subscribe((data: any) => {
      let totalRevenue = data.collectedSum + data.invoicedSum + data.outstandingSum;
      this.totalRevenue = totalRevenue.toFixed(2);
      if (totalRevenue > 100000) {
        this.totalRevenue = (totalRevenue / 100000).toFixed(2) + 'L'
      } else if (totalRevenue > 1000) {
        this.totalRevenue = (totalRevenue / 1000).toFixed(2) + 'k'
      }
      this.invoicedSum = data.invoicedSum;
      this.collectedSum = data.collectedSum;
      this.outstandingSum = data.outstandingSum;
      this.month = month;
      this.data = [ 
        {
          "label" : "Invoiced Sum" ,
          "value" : data.invoicedSum
        } ,
        {
          "label" : "Collected Sum" ,
          "value" : data.collectedSum
        } ,
        {
          "label" : "Outstanding Sum" ,
          "value" : data.outstandingSum
        }
    ]
    if (!this.cd['destroyed']) {
      this.cd.detectChanges();
    }
    });
    this.sub.add(getRevenue);
  }



}

export interface InvoiceRevenue {
  startDate: string;
  endDate: string;
  id: string;
}
