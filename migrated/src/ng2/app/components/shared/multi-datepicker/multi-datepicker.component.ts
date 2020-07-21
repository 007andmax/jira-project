import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbDate, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { DateService } from "../../../services/date/date.service";

/**
 * Multi date picker
 */
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
    private dateService: DateService
  ) { }

  ngOnInit() { }

  /**
   * check type for hover
   * @param date - date for select
   */
  onDateSelection(date: NgbDate) {
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
    this.selectedDate.next({
      start: '',
      end: ''
    });
    this.fromDate = undefined;
    this.toDate = undefined;
    this.setSelectedDateModel('', '');
    this.hideDatePicker();
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
