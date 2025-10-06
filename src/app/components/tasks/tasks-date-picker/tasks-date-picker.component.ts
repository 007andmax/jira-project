import { ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MultiDatepickerComponent } from '../../shared/multi-datepicker/multi-datepicker.component';
import * as moment from "moment";
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { DateService } from 'src/app/services/date/date.service';
import { TicketProfileUpdatesServiceTimepickerComponent } from '../../tickets/tickets/ticket-edit-aside/ticket-profile-updates/ticket-profile-updates-service-timepicker/ticket-profile-updates-service-timepicker.component';


@Component({
  selector: 'app-tasks-date-picker',
  templateUrl: './tasks-date-picker.component.html',
  styleUrls: ['./tasks-date-picker.component.scss']
})
export class TasksDatePickerComponent extends MultiDatepickerComponent {
  @Input() type: string = "TASKS";
  @Input() container: string = null;
  durationStart: number = new Date().getTime();
  durationEnd: number = new Date().getTime();
  @ViewChild('dp', { static: true }) dp;
  @ViewChild('editTimePicker', { static: true }) editTimePicker: TicketProfileUpdatesServiceTimepickerComponent;
  isInitCloseOutside: boolean = false;
  @Input() editStart: number;
  @Input() editEnd: number;
  @Output() onCloseDropDown = new EventEmitter<any>();
  constructor(public dateService: DateService,
    public cd: ChangeDetectorRef,) {
    super(dateService);
  }

  ngOnInit() {
    if (this.editStart && this.editEnd) this.setEditDates(this.editStart, this.editEnd);
    this.dp.autoClose = false;
  }
  openChange(data) {
    setTimeout(() => {
      this.isInitCloseOutside = data;
    }, 500);
    this.onCloseDropDown.emit(!data);
  }
  public setEditDates(editStart, editEnd) {
    if (editStart) this.fromDate = new NgbDate(new Date(editStart).getFullYear(), new Date(editStart).getMonth() + 1, new Date(editStart).getDate());
    if (editEnd) this.toDate = new NgbDate(new Date(editEnd).getFullYear(), new Date(editEnd).getMonth() + 1, new Date(editEnd).getDate());
    if (editStart) this.editTimePicker.start = editStart;
    if (editEnd) this.editTimePicker.end = editEnd;
    this.editTimePicker.editMode = true;
    this.setSelectedDateModel(this.fromDate, this.toDate);
  }
  onToggleTimePicker(data) {
    if (!data) {
      setTimeout(() => {
        this.isInitCloseOutside = true;
      }, 500);
    } else {
      this.isInitCloseOutside = false;
    }
    this.cd.detectChanges();
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
      this.selectedDate.next({
        start: start.getTime(),
        end: end.getTime(),
      });
      this.setSelectedDateModel(this.fromDate, this.toDate);
    }
  }
}
