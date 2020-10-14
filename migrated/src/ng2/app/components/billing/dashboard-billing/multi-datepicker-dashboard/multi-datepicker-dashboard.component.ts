import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { DateService } from 'src/ng2/app/services/date/date.service';
import * as moment from "moment";
 
@Component({
  selector: 'app-multi-datepicker-dashboard',
  templateUrl: './multi-datepicker-dashboard.component.html',
  styleUrls: ['./multi-datepicker-dashboard.component.scss']
})
export class MultiDatepickerDashboardComponent implements OnInit {

  hoveredDate: NgbDate;
  fromDate: NgbDate;
  @Input() accountingStartDate:string;
  toDate: NgbDate;
  public navigation = 'select';
  public showDatePicker = false;
  public selectedDateModel = '';
  public outsideDays = 'hidden';
  isDisabled = false;
  @Output() selectedDate = new EventEmitter<any>();

  /**
   * Creates an instance of the MultiDatepickerComponent with the injected services
   * @param {NgbCalendar} calendar Service to work with date
   * @param {DateService} dateService Service to work with date
   */
  constructor(
    private calendar: NgbCalendar,
    private dateService: DateService,
    public cd: ChangeDetectorRef,
  ) { }

  ngOnInit() { }

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
    if (this.fromDate && this.toDate) {
      this.selectedDate.next({
        start: this.dateService.getDateFromBootstrap(this.fromDate),
        end: this.dateService.getDateFromBootstrap(this.toDate),
      });

      this.setSelectedDateModel(this.fromDate, this.toDate);
      this.hideDatePicker();
    }
  }

  /**
   * check type for hover
   * @param date - date range for check
   */
  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  /**
   * check is inside
   * @param date - date range for check
   */
  public isInside(date: NgbDate) {
    return date.after(this.fromDate) && date.before(this.toDate);
  }

  /**
   * check type for range
   * @param date - date range for check
   */
  public isRange(date: NgbDate) {
    return date.equals(this.fromDate) || date.equals(this.toDate) || this.isInside(date) || this.isHovered(date);
  }

  /**
   * toggle date picker
   */
  public toggleDatePicker() {
    if (this.isDisabled) return;
    this.showDatePicker = !this.showDatePicker;
  }

  /**
   * Hide datepicker
   */
  public hideDatePicker() {
    this.showDatePicker = false;
  }

  /**
   * Set selected date
   */
  public setSelectedDateModel(start, end) {
    if (start && end) {

      const startDate = new Date(this.dateService.getDateFromBootstrap(start));
      const endDate = new Date(this.dateService.getDateFromBootstrap(end));

      this.selectedDateModel = `${this.dateService.getInvoiceDate(startDate)} - ${this.dateService.getInvoiceDate(endDate)}`;
    } else {
      this.selectedDateModel = '';
    }
  }

  /**
   * Clear date picker date
   */
  public clearDate() {
    this.fromDate = undefined;
    this.toDate = undefined;
    this.selectedDate.next({
      start: '',
      end: ''
    });
   
    this.setSelectedDateModel('', '');
    this.hideDatePicker();
  }
  public selectYearToDate() {
    let current = this.calendar.getToday();
    current.month = 1;
    current.day = 1;
    this.fromDate = current;
    console.log("this.fromDate", this.fromDate);
    this.toDate = this.calendar.getToday();
    console.log("this.toDate", this.toDate);
    this.selectedDate.next({
      start: this.dateService.getDateFromBootstrap(this.fromDate),
      end: this.dateService.getDateFromBootstrap(this.toDate),
    });
  }
  public getSelectedInterval() {
    let startDate = (this.fromDate) ? new Date(this.fromDate.year, this.fromDate.month - 1, this.fromDate.day) : new Date();
    let endDate = (this.toDate) ? new Date(this.toDate.year, this.toDate.month - 1, this.toDate.day) : new Date();
    return `${moment(startDate).format('DD MMM YYYY')} - ${moment(endDate).format('DD MMM YYYY')}`;
  }
  public selectLast90Days() {
    let current = this.calendar.getToday();
    this.fromDate = this.calendar.getPrev(current, "d", 90);
    console.log("this.fromDate", this.fromDate);
    this.toDate = current;
    console.log("this.toDate", this.toDate);
    this.selectedDate.next({
      start: this.dateService.getDateFromBootstrap(this.fromDate),
      end: this.dateService.getDateFromBootstrap(this.toDate),
    });
  }
  public selectLastMonth() {
    let current = this.calendar.getToday();
    this.fromDate = this.calendar.getPrev(current, "m", 1);
    this.fromDate.day = 1;
    console.log("this.fromDate", this.fromDate);
    this.toDate = this.calendar.getPrev(current, "m", 1);
    this.toDate.day = new Date(current.year, current.month - 1, 0).getDate();
    console.log("this.toDate", this.toDate);
    this.selectedDate.next({
      start: this.dateService.getDateFromBootstrap(this.fromDate),
      end: this.dateService.getDateFromBootstrap(this.toDate),
    });
  }
  public selectCurrentMonth() {
    this.fromDate = this.calendar.getToday();
    this.fromDate.day = 1;
    this.toDate = this.calendar.getToday();
    this.toDate.day = 31;
    this.selectedDate.next({
      start: this.dateService.getDateFromBootstrap(this.fromDate),
      end: this.dateService.getDateFromBootstrap(this.toDate),
    });
    /* this.datepicker = date;
     if (this.navDate) this.sericeDatePicker.updateMonthAndYearDatePicker(this.datepicker, this.navDate);
     this.updateDate();*/
  }
  public setStartDate(data) {
    this.fromDate = new NgbDate(data.getFullYear(),data.getMonth() + 1,data.getDate());
   
  }
  public setEndDate(data) {
    this.toDate = new NgbDate(data.getFullYear(),data.getMonth() + 1,data.getDate());
  }
  public clearWithOutChanges() {

    this.fromDate = undefined;
    this.toDate = undefined;
    this.setSelectedDateModel('', '');
    this.hideDatePicker();
  }

  public setDisabled(data) {
    this.isDisabled = data;
  }

}
