import { Component, Input } from '@angular/core';
import { MultiDatepickerComponent } from '../../shared/multi-datepicker/multi-datepicker.component';
import * as moment from "moment";
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-tasks-date-picker',
  templateUrl: './tasks-date-picker.component.html',
  styleUrls: ['./tasks-date-picker.component.scss']
})
export class TasksDatePickerComponent extends MultiDatepickerComponent {
  @Input() container: string = null;
  durationStart: number = new Date().getTime();
  durationEnd: number = new Date().getTime();

  @Input() editStart: number;
  @Input() editEnd: number;

  ngOnInit() {
    if (this.editStart && this.editEnd) this.setEditDates(this.editStart, this.editEnd);
  }

  public setEditDates(editStart, editEnd) {
    console.log("editStart, editEnd", editStart, editEnd);
    if (editStart) this.fromDate = new NgbDate(new Date(editStart).getFullYear(), new Date(editStart).getMonth() + 1, new Date(editStart).getDate());
    if (editEnd) this.toDate = new NgbDate(new Date(editEnd).getFullYear(), new Date(editEnd).getMonth() + 1, new Date(editEnd).getDate());
    console.log("this.fromDat", this.fromDate);
  }

  public onChangeStartTimePickerService(data) {
    this.durationStart = data;
    this.changeDate();
  }
  public onChangeEndTimePickerSerice(data) {
    this.durationEnd = data;
    this.changeDate();
  }
  public parseStartDate() {
    return this.fromDate ? moment(this.dateService.getDateFromBootstrap(this.fromDate)).format('DD MMM YYYY') : '';
  }
  public parseEndDate() {
    return this.toDate ? moment(this.dateService.getDateFromBootstrap(this.toDate)).format('DD MMM YYYY') : '';
  }
  /**
    * check type for hover
    * @param date - date for select
    */
  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
    this.changeDate();
  }
  changeDate() {
    if (this.fromDate && this.toDate) {
      let start = new Date(this.dateService.getDateFromBootstrap(this.fromDate));
      start.setHours(new Date(this.durationStart).getHours());
      start.setMinutes(new Date(this.durationStart).getMinutes());
      let end = new Date(this.dateService.getDateFromBootstrap(this.toDate));
      end.setHours(new Date(this.durationEnd).getHours());
      end.setMinutes(new Date(this.durationEnd).getMinutes());
      console.log("durationStart", this.durationStart);
      this.selectedDate.next({
        start: start.getTime(),
        end: end.getTime(),
      });

      this.setSelectedDateModel(this.fromDate, this.toDate);
    }
  }
}
