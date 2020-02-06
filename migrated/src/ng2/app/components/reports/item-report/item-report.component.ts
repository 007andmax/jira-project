import { Component, OnInit, ChangeDetectorRef, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReportsStateService } from 'src/ng2/app/states/reports/reports-state.service';
import { GlNumber } from '../class/gl-number';
import { GlNumberItem } from '../class/gl-number-item';
import * as $ from 'jquery';
import { ReportsService } from 'src/ng2/app/services/reports/reports.service';
import { ACION_OPEN_PDF, ACION_DOWNLOAD_PDF } from 'src/ng2/app/const/reports';
import { AppService } from 'src/ng2/app/states/app/app.service';

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

  constructor(private route: ActivatedRoute, private reportsStateService: ReportsStateService,
    private reportsService: ReportsService,
    public cd: ChangeDetectorRef,
    private elRef: ElementRef,
    private appService: AppService) { }

  ngOnInit() {
    if (localStorage.report) this.report = localStorage.report;
    this.reportsStateService.glNumber.subscribe((data: GlNumber) => {
      this.glNumber = data;
      console.log("this.glNumber", this.glNumber);
      console.log("this.glNumber.list", this.glNumber.list);
      this.cd.detectChanges();
    })
  }
  public onRequest(data) {
    this.loadingInProgress = data;
  }
  public getReport(data) {

  }
  onSelectedClient(client) {
    this.selectedClient = client;
    console.log("this.selectClient",this.selectedClient);
  }

}
