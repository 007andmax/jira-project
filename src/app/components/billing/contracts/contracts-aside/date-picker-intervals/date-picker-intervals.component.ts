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
    let last_day = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0);
    console.log("endDate.getDate()", endDate.getDate());
    console.log("last_day", last_day.getDate());
    let dates = [];
    if (this.intervalstring === 'YEARLY') {
      let newDate = new Date(endDate.getFullYear() + 1, endDate.getMonth(), endDate.getDate() - 1);
      dates.push(newDate);
    } else if (this.intervalstring === 'MONTHLY') {
      const target = new Date(date.year, date.month - 1, date.day);

      while (endDate <= target) {
        const intervalDate = new Date(endDate);
        intervalDate.setMonth(intervalDate.getMonth() + 1);


        if (endDate.getDate() == 30 && last_day.getDate() == 31) {
          let last_day_target = new Date(target.getFullYear(), target.getMonth() + 1, 0);
          if (target.getDate() == 30 && last_day_target.getDate() == 31 || target.getDate() == 30 && last_day_target.getDate() == 30 || (target.getDate() == 28 || target.getDate() == 29) && last_day_target.getDate() == target.getDate()) { return false; } else {
            return true;
          }
        } else if (endDate.getDate() == last_day.getDate()) {
          let last_day_target = new Date(target.getFullYear(), target.getMonth() + 1, 0);
          if (target.getDate() == last_day_target.getDate()) {
            return false;
          } else {
            return true;
          }
        } else {
          intervalDate.setDate(intervalDate.getDate() - 1); // Apply -1 day
          if (
            intervalDate.getFullYear() === target.getFullYear() &&
            intervalDate.getMonth() === target.getMonth() &&
            intervalDate.getDate() === target.getDate()
          ) {
            return false;
          }
        }
        // Check if the interval date matches the selected date


        // Move to next interval start: +1 month from current start date
        endDate.setMonth(endDate.getMonth() + 1);
      }

      return true;





      for (let i = 1; i <= 12; i++) {
        let newDate;
        if (endDate.getDate() == 30 && last_day.getDate() == 31) {
          newDate = new Date((endDate.getMonth() + i) >= 12 ? endDate.getFullYear() + 1 : endDate.getFullYear(), (endDate.getMonth() + i) >= 12 ? endDate.getMonth() + i - 12 : endDate.getMonth() + i, 1);
          let last_day_newDate = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0);
          if (last_day_newDate.getDate() < 30) { newDate.setDate(last_day_newDate.getDate()) } else {
            newDate.setDate(30);
          }
        } else if (endDate.getDate() == last_day.getDate()) {
          newDate = new Date((endDate.getMonth() + i) >= 12 ? endDate.getFullYear() + 1 : endDate.getFullYear(), (endDate.getMonth() + i) >= 12 ? endDate.getMonth() + i - 12 : endDate.getMonth() + i, 1);
          let last_day_newDate = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0);
          newDate.setDate(last_day_newDate.getDate())
        } else {
          newDate = new Date((endDate.getMonth() + i) >= 12 ? endDate.getFullYear() + 1 : endDate.getFullYear(), (endDate.getMonth() + i) >= 12 ? endDate.getMonth() + i - 12 : endDate.getMonth() + i, endDate.getDate() - 1);
        }
        dates.push(newDate);
      }
    } else {
      while (endDate.getTime() < new Date().getTime() + 60000 * 60 * 24 * 365) {
        if (this.intervalstring === '30 days') endDate.setTime(endDate.getTime() + 60000 * 60 * 24 * 29);
        if (this.intervalstring === '15 days') endDate.setTime(endDate.getTime() + 60000 * 60 * 24 * 14);
        if (this.intervalstring === '7 days') endDate.setTime(endDate.getTime() + 60000 * 60 * 24 * 7);
        dates.push(new Date(JSON.parse(JSON.stringify(endDate.getTime()))));
      }
    }
    //  console.log("dates", dates);
    return !dates.some(item => date.day === item.getDate() && date.month === item.getMonth() + 1 && date.year === item.getFullYear());
  }
}
