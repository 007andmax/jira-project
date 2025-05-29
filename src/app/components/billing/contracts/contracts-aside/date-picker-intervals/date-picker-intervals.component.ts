import { Component, Input, OnInit } from '@angular/core';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerComponent } from 'src/app/components/shared/date-picker/date-picker.component';
import { DatePickerService } from 'src/app/components/shared/date-picker/services/date-picker.service';

@Component({
  selector: 'app-date-picker-intervals',
  templateUrl: './date-picker-intervals.component.html',
  styleUrls: ['./date-picker-intervals.component.scss'],
  providers: [DatePickerService]
})
export class DatePickerIntervalsComponent extends DatePickerComponent {
  @Input() intervalstring: string = "";

  markDisabled = (date: NgbDate, current: { month: number, year: number }) => {
    let endDate = new Date();
    let dates = [];
    while (endDate.getTime() < new Date().getTime() + 60000 * 60 * 24 * 365) {
      dates.push(new Date(JSON.parse(JSON.stringify(endDate.getTime()))));
      if (this.intervalstring === 'MONTHLY' || this.intervalstring === 'YEARLY') endDate.setMonth(endDate.getMonth() + 1);
      if (this.intervalstring === '30 days') endDate.setDate(endDate.getDate() + 29 * 12 - 1);
      if (this.intervalstring === '15 days') endDate.setDate(endDate.getDate() + 28 * 12 - 1);
      if (this.intervalstring === '7 days') endDate.setDate(endDate.getDate() + 7);
    }
    console.log("dates", dates.length);
    return dates.some(item => (date.day !== item.getDate() && current.month === item.getMonth() + 1));
    /*
    if (this.intervalstring === 'MONTHLY' || this.intervalstring === 'YEARLY') {
      let startDate = new Date();
      let endDate = new Date();
      let dates = [];
      while (endDate.getTime() < new Date().getTime() + 60000 * 60 * 24 * 365) {
        dates.push(endDate);
        endDate.setMonth(endDate.getMonth() + 1);
      }
      return dates.some(item => (date.day === item.getDate() && date.month === item.getMonth() + 1));
      dates.forEach(item => {
        if (date.day !== item.getDate() && date.month !== item.getMonth() + 1)
      })
 
      endDate.setFullYear(endDate.getFullYear() + 50);
      endDate.setDate(endDate.getDate() - 1);
      this.endDate = moment(endDate).format('YYYY/MM/DD');
 
    } else if (this.intervalstring === '30 days') {
      let endDate = new Date(this.startDate);
      endDate.setDate(endDate.getDate() + 29 * 12 * 50);
      endDate.setDate(endDate.getDate() - 1);
      this.endDate = moment(endDate).format('YYYY/MM/DD');
 
    } else if (this.intervalstring === '15 days') {
      let endDate = new Date(this.startDate);
      endDate.setDate(endDate.getDate() + 28 * 12 * 50);
      endDate.setDate(endDate.getDate() - 1);
      this.endDate = moment(endDate).format('YYYY/MM/DD');
 
    } else if (this.intervalstring === '7 days') {
      let endDate = new Date(this.startDate);
      endDate.setFullYear(endDate.getFullYear() + 50);
      endDate.setDate(endDate.getDate() - 7);
      this.endDate = moment(endDate).format('YYYY/MM/DD');
 
    }*/

  }
}
