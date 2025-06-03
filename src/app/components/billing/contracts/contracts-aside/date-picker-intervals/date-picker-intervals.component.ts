import { ChangeDetectorRef, Component, ElementRef, Input, OnInit } from '@angular/core';
import { NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerComponent } from 'src/app/components/shared/date-picker/date-picker.component';
import { DatePickerStateService } from 'src/app/components/shared/date-picker/services/date-picker-state.service';
import { DatePickerService } from 'src/app/components/shared/date-picker/services/date-picker.service';
declare var $: any;

@Component({
  selector: 'app-date-picker-intervals',
  templateUrl: './date-picker-intervals.component.html',
  styleUrls: ['./date-picker-intervals.component.scss'],
  providers: [DatePickerService]
})
export class DatePickerIntervalsComponent extends DatePickerComponent {
  @Input() intervalstring: string = "";

  markDisabled = (date: NgbDate, current: { month: number, year: number }) => {
    let endDate = new Date(this.fromDate);
    //  console.log("endDate", endDate);
    let dates = [];
    if (this.intervalstring === 'YEARLY') {
      let newDate = new Date(endDate.getFullYear() + 1, endDate.getMonth(), endDate.getDate() - 1);
      dates.push(newDate);
    } else if (this.intervalstring === 'MONTHLY') {
      for (let i = 1; i <= 12; i++) {
        let newDate = new Date((endDate.getMonth() + i) >= 12 ? endDate.getFullYear() + 1 : endDate.getFullYear(), (endDate.getMonth() + i) >= 12 ? endDate.getMonth() + i - 12 : endDate.getMonth() + i, endDate.getDate() - 1);
        dates.push(newDate);
      }
    } else {
      while (endDate.getTime() < new Date().getTime() + 60000 * 60 * 24 * 365) {
        // let changeDate = new Date(endDate.getTime() + 60000 * 60 * 24 * 29);
        if (this.intervalstring === '30 days') endDate.setTime(endDate.getTime() + 60000 * 60 * 24 * 29);
        if (this.intervalstring === '15 days') endDate.setTime(endDate.getTime() + 60000 * 60 * 24 * 14);
        if (this.intervalstring === '7 days') endDate.setTime(endDate.getTime() + 60000 * 60 * 24 * 7);
        dates.push(new Date(JSON.parse(JSON.stringify(endDate.getTime()))));
      }
    }


    //console.log("dates", dates);
    // console.log("date", date);
    return !dates.some(item => date.day === item.getDate() && date.month === item.getMonth() + 1 && date.year === item.getFullYear());
  }
}
