import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
 

@Component({
  selector: 'app-item-report',
  templateUrl: './item-report.component.html',
  styleUrls: ['./item-report.component.scss']
})
export class ItemReportComponent implements OnInit {

  report: string;
 
  constructor( 
    public cd: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    if (localStorage.report) this.report = localStorage.report;
    console.log("this.report",this.report);
    
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
