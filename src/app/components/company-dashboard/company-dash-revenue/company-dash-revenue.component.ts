import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CompaniesService } from 'src/app/services/company/companies.service';
import * as moment from "moment";
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-company-dash-revenue',
  templateUrl: './company-dash-revenue.component.html',
  styleUrls: ['./company-dash-revenue.component.scss']
})
export class CompanyDashRevenueComponent implements OnInit, OnDestroy {

  _id: string = '';
  month: string = '12';
  totalRevenue: string = '';
  invoicedSum: number = 0;
  collectedSum: number = 0;
  outstandingSum: number = 0;
  data: any;
  sub: Subscription = new Subscription();
  chartColors = { domain: ["#0747a6", "#00ccff", '#cdecff'] };
  public constructor(private companiesService: CompaniesService,
    public activateRoute: ActivatedRoute,
    public cd: ChangeDetectorRef) { }


  public ngOnInit() {
    this._id = this.activateRoute.snapshot.params['id'];
    let subscription = this.activateRoute.params.subscribe(params => {
      this._id = params['id'];
      this.getInvoiceRevenue('12');
    });
    this.sub.add(subscription);
    this.data = [];
  }

  getInvoiceRevenue(month) {
    let obj: InvoiceRevenue = {
      startDate: moment(new Date()).subtract(month, 'months').format('YYYY-MM-DD'),
      endDate: moment(new Date()).format('YYYY-MM-DD'),
      id: this._id
    };
    let getRevenue = this.companiesService.getInvoiceRevenue(obj).subscribe((data: any) => {
      let totalRevenue = data.invoicedSum;
      this.totalRevenue = totalRevenue.toFixed(2);
      if (totalRevenue > 1000) this.totalRevenue = (totalRevenue / 1000).toFixed(2) + 'k';
      this.invoicedSum = data.invoicedSum;
      this.collectedSum = data.collectedSum;
      this.outstandingSum = data.outstandingSum;
      this.month = month;
      this.data = [
        {
          "name": "Invoiced Sum",
          "value": data.invoicedSum.toFixed(2)
        },
        {
          "name": "Collected Sum",
          "value": data.collectedSum.toFixed(2)
        },
        {
          "name": "Outstanding Sum",
          "value": data.outstandingSum.toFixed(2)
        }
      ]
      if (!this.cd['destroyed']) {
        this.cd.detectChanges();
      }
    });
    this.sub.add(getRevenue);
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}

export interface InvoiceRevenue {
  startDate: string;
  endDate: string;
  id: string;
}
