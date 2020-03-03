import { Component, OnInit, ChangeDetectorRef, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReportsStateService } from 'src/ng2/app/states/reports/reports-state.service';
import { GlNumber } from '../class/gl-number';
import { GlNumberItem } from '../class/gl-number-item';
import * as $ from 'jquery';
import * as moment from "moment";
import { ReportsService } from 'src/ng2/app/services/reports/reports.service';
import { ACION_OPEN_PDF, ACION_DOWNLOAD_PDF } from 'src/ng2/app/const/reports';
import { AppService } from 'src/ng2/app/states/app/app.service';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { CompaniesService } from 'src/ng2/app/services/company/companies.service';
import { TransitionCheckState } from '@angular/material';
import { CurrentUser } from 'src/ng2/class/current-user/current-user';
import { UsersStateService } from 'src/ng2/app/states/users/users-state.service';

@Component({
  selector: 'app-item-report',
  templateUrl: './item-report.component.html',
  styleUrls: ['./item-report.component.scss']
})
export class ItemReportComponent implements OnInit {

  report: string;
  glNumber: GlNumber = new GlNumber();
  loadingInProgress: boolean = false;
  selectedClient = null;
  techCompany = null;
  showHeaders = false;
  currentUser: CurrentUser;
  currentCompany: any = null;
  constructor(private route: ActivatedRoute, private reportsStateService: ReportsStateService,
    private reportsService: ReportsService,
    public cd: ChangeDetectorRef,
    private elRef: ElementRef,
    private appService: AppService,
    private companiesService: CompaniesService,
    private companiesStateService: CompaniesStateService,
    private usersStateService: UsersStateService,
  ) { }

  ngOnInit() {
    if (localStorage.report) this.report = localStorage.report;
    this.reportsStateService.glNumber.subscribe((data: GlNumber) => {
      this.glNumber.setDataFromObject(JSON.parse(JSON.stringify(data.getDataObject())));
      console.log("this.glNumber", this.glNumber);
      console.log("this.glNumber.list", this.glNumber.list);
      let item = new GlNumberItem("", "", (this.glNumber.list.length > 0) ? this.glNumber.list[0].sum.length : null);
      let total = 0;
      this.glNumber.list.forEach(item => {
        total += item.total;
      })
      item.glNumber = "";
      item.description = "";
      let count = 0;
      if (this.glNumber.list.length > 0) {
        while (count < this.glNumber.list[0].sum.length) {
          let item_sum = 0;
          this.glNumber.list.forEach((itemList, index) => {
            item_sum += itemList.sum[count];

          });
          item.setSum(count, item_sum);
          count++;
        }
      }

      item.total = total;
      console.log("item", item);
      this.glNumber.list.push(item);
     
      this.cd.detectChanges();
    })

    this.techCompany = this.companiesStateService.getCurrentCompany();
    this.companiesService.getTechCompany().subscribe(data => {
      this.techCompany = data;
    })
    this.currentUser = this.usersStateService.getCurrentUser();
    this.currentCompany = this.companiesStateService.getCurrentCompany();
    console.log("currentUser", this.currentUser);
  }
  public onRequest(data) {
    this.loadingInProgress = data;
    this.cd.detectChanges();
  }
  public getReport(data) {

  }
  onSelectedClient(client) {
    this.selectedClient = client;
    console.log("this.selectClient", this.selectedClient);
  }
  perseStartDate() {
    return moment(this.glNumber.startDate).format('DD MMM YYYY')
  }
  perseEndDate() {
    return moment(this.glNumber.endDate).format('DD MMM YYYY')
  }
  back() {

    let body = document.querySelector('.left-panel__category-wrap');
    var link = document.createElement('a');
    body.appendChild(link);
    link.href = `#/reports`;
    var e = document.createEvent('MouseEvents');
    e.initEvent('click', true, true);
    link.dispatchEvent(e);
  }
  parseTotal(value) {
    return parseFloat(value.toString()).toFixed(2)
  }
}
