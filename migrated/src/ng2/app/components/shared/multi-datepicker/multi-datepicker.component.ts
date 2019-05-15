import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbDate, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { DateService } from "../../../services/date/date.service";

@Component({
  selector: 'app-multi-datepicker',
  templateUrl: './multi-datepicker.component.html',
  styleUrls: ['./multi-datepicker.component.scss']
})
export class MultiDatepickerComponent implements OnInit {

  hoveredDate: NgbDate;

  fromDate: NgbDate;
  toDate: NgbDate;
  public navigation = 'select';
  public showDatePicker = false;
  @Output() selectedDate = new EventEmitter<any>();

  constructor(
    private calendar: NgbCalendar,
    private dateService: DateService
              ) {
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
  }

  ngOnInit() {
  }

  onDateSelection(date: NgbDate) {
    console.log(date);
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
    if (this.fromDate && this.toDate) {
      this.selectedDate.next({
        start: this.dateService.getDateFromBootstrap(this.fromDate),
        end: this.dateService.getDateFromBootstrap(this.toDate),
      });
      this.hideDatePicker();
    }
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || date.equals(this.toDate) || this.isInside(date) || this.isHovered(date);
  }

  public toggleDatePicker() {
    this.showDatePicker = !this.showDatePicker;
  }

  public hideDatePicker() {
    this.showDatePicker = false;
  }

}
