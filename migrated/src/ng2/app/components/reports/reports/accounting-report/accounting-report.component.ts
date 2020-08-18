import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-accounting-report',
  templateUrl: './accounting-report.component.html',
  styleUrls: ['./accounting-report.component.scss']
})
export class AccountingReportComponent implements OnInit {
  loadingInProgress: boolean = false;
  onInit = false;
  constructor() { }

  ngOnInit() {
  }

}
