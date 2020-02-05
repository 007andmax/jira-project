import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReportsStateService } from 'src/ng2/app/states/reports/reports-state.service';
import { GlNumber } from '../class/gl-number';
import { GlNumberItem } from '../class/gl-number-item';

@Component({
  selector: 'app-item-report',
  templateUrl: './item-report.component.html',
  styleUrls: ['./item-report.component.scss']
})
export class ItemReportComponent implements OnInit {
  report: string;
  glNumber: GlNumber = new GlNumber();
  loadingInProgress: boolean = false;
  constructor(private route: ActivatedRoute, private reportsStateService: ReportsStateService,
    public cd: ChangeDetectorRef,) { }

  ngOnInit() {
    if (localStorage.report) this.report = localStorage.report;
    this.reportsStateService.glNumber.subscribe((data:GlNumber) => {
      this.glNumber = data;
      console.log("this.glNumber",this.glNumber);
      console.log("this.glNumber.list",this.glNumber.list);
      this.cd.detectChanges();
    })
  }
  public onRequest(data) {
this.loadingInProgress = data;
  }
  public getReport(data) {
 
  }

}
