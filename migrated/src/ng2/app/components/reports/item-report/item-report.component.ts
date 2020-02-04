import { Component, OnInit } from '@angular/core';
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
  constructor(private route: ActivatedRoute, private reportsStateService: ReportsStateService) { }

  ngOnInit() {
    if (localStorage.report) this.report = localStorage.report;
    console.log(localStorage.report);
    console.log('this.report', this.report);

    this.reportsStateService.glNumber.subscribe(data => {
      this.glNumber = data;
    })
  }
  public getReport(data) {
    this.glNumber = new GlNumber();
    let keys = Object.keys(data);
    keys = keys.sort();
    console.log("keys", keys);
    
    keys.forEach((key,indexKey) => {
      console.log("key", key);
      const element = data[key];
      this.glNumber.addDate(key);
      element.forEach((item, indexItem) => {
        let index = this.glNumber.getList().findIndex(itemList => itemList.glNumber === item.glNumber);
        if (index > -1) {
          this.glNumber.getList()[index].setSum(indexKey,item.sum);
          this.glNumber.getList()[index].updateTotal(item.sum);
        } else {
          this.glNumber.addItem(new GlNumberItem(item.glNumber, item.description, keys.length));
          let indexLast = this.glNumber.getList().length - 1;
          this.glNumber.getList()[indexLast].setSum(indexKey,item.sum);
          this.glNumber.getList()[indexLast].updateTotal(item.sum);
        }
      });
   
    });
    this.reportsStateService.onGetGlNumber(this.glNumber);
  }

}
