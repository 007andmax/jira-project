import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';


@Component({
  selector: 'app-item-report',
  templateUrl: './item-report.component.html',
  styleUrls: ['./item-report.component.scss']
})
export class ItemReportComponent implements OnInit, OnDestroy {

  report: string;

  constructor(
    private leftPanelStateService: LeftPanelStateService,
    public cd: ChangeDetectorRef,
  ) { }


  ngOnInit() {
    if (localStorage.report) this.report = localStorage.report;
  }
  back() {
    this.leftPanelStateService.goToState('new-reports');
    /*  let body = document.querySelector('.main-container');
      var link = document.createElement('a');
      body.appendChild(link);
      link.href = `#/reports`;
      var e = document.createEvent('MouseEvents');
      e.initEvent('click', true, true);
      link.dispatchEvent(e);*/
  }
  parseTotal(value) {
    return parseFloat(value.toString()).toFixed(2)
  }
  ngOnDestroy(): void {
    this.report = null;
  }
}
