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
  constructor(private route: ActivatedRoute, private reportsStateService: ReportsStateService,
    private reportsService: ReportsService,
    public cd: ChangeDetectorRef,
    private elRef: ElementRef,
    private appService: AppService,
    private companiesService: CompaniesService,
    private companiesStateService: CompaniesStateService) { }

  ngOnInit() {
    if (localStorage.report) this.report = localStorage.report;
    this.reportsStateService.glNumber.subscribe((data: GlNumber) => {
      this.glNumber.setDataFromObject(JSON.parse(JSON.stringify(data.getDataObject())));
      console.log("this.glNumber", this.glNumber);
      console.log("this.glNumber.list", this.glNumber.list);
      this.cd.detectChanges();
    })

    this.techCompany = this.companiesStateService.getCurrentCompany();
    this.companiesService.getTechCompany().subscribe(data => {
      this.techCompany = data;
    })
  }
  public onRequest(data) {
    this.loadingInProgress = data;
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

}
