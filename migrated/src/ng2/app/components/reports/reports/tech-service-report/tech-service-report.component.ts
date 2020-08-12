import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
@Component({
  selector: 'app-tech-service-report',
  templateUrl: './tech-service-report.component.html',
  styleUrls: ['./tech-service-report.component.scss']
})
export class TechServiceReportComponent implements OnInit {
  loadingInProgress: boolean = false;
  list = [];
  constructor() { }

  ngOnInit() {
  }
  public onRequest(data) {
    this.loadingInProgress = data;
    //  this.cd.detectChanges();
  }
  public getReport(data) {
    console.log("data", data);
    this.list = data.lines;
  }
  public getDate(date) {
    return moment((date) ? new Date(date) : new Date()).format('DD MMM YYYY');
  }
}
