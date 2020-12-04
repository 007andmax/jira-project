import { Component, OnInit, ViewChild, ChangeDetectorRef, ElementRef, EventEmitter, Output, OnDestroy, Input } from '@angular/core';
import { NgbDropdown, NgbDateStruct, NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { RecurringTicketsEditAsideDate } from '../../tickets/recurring-tickets/class/recurring-tickets-edit-aside-date';
import { DatePickerStateService } from './services/date-picker-state.service';
import { ChangeDatePicker } from './class/change-date-picker';
import { NgbDatepickerNavigateEvent } from '@ng-bootstrap/ng-bootstrap/datepicker/datepicker';
import { DatePickerService } from './services/date-picker.service';
import { TYPE_INPUT, FORMAT_DATE_1 } from 'src/ng2/app/const/date-picker';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
  providers: [DatePickerService]
})
export class DatePickerComponent implements OnInit, OnDestroy {

  @ViewChild('date') date_dropDown: NgbDropdown;
  @Input() type: string = TYPE_INPUT;
  @Input() formatDate: string = FORMAT_DATE_1;
  @Input() editMode: boolean = false;
  @Input() disabled: boolean = false;
  @Input() editDate: number = 0;
  @Input() useMinDate: boolean = true;
  @Input() useMaxDate: boolean = false;
  @Input() minDate: number = new Date().getTime();
  @Input() maxDate: number = new Date().getTime();
  @Input() placement: string = "bottom";
  @Output() onChange: EventEmitter<ChangeDatePicker> = new EventEmitter();
  public datepicker: NgbDateStruct;
  public date: RecurringTicketsEditAsideDate = new RecurringTicketsEditAsideDate();
  public navDate: any;
  public minDateDP: NgbDateStruct = null;
  public maxDateDP: NgbDateStruct = null;
  /**
  * Creates an instance of the DatePickerComponent with the injected services
  * @param {NgbCalendar} calendar to work calendar api
  * @param {ChangeDetectorRef} cd Service to work with date
  * @param {DatePickerStateService} stateDatePicker to work date picker state
  * @param {DatePickerService} sericeDatePicker Service to work with date picker
  */
  constructor(private calendar: NgbCalendar,
    public cd: ChangeDetectorRef,
    private stateDatePicker: DatePickerStateService,
    private sericeDatePicker: DatePickerService) { }


  /**
 * Initializes date picker. See [ngOnInit]{@see OnInit#ngOnInit}
 */
  ngOnInit() {


    // if (this.useMinDate) this.minDateDP = this.sericeDatePicker.getDateStruct(this.minDate);
    //  if (this.useMaxDate) this.maxDateDP = this.sericeDatePicker.getDateStruct(this.maxDate);

    this.oninitreset();
    this.onInitEditMode();
    this.oninitClear();

    if (this.editMode) this.setEditDate(this.editDate);

  }
  ngDoCheck() {
    if (this.useMinDate) this.minDateDP = this.sericeDatePicker.getDateStruct(this.minDate);
    if (this.useMaxDate) this.maxDateDP = this.sericeDatePicker.getDateStruct(this.maxDate);

  }


  /**
  * Subscribe to clear date picker
  */
  private oninitClear() {
    let clear = this.stateDatePicker.getOnClear().subscribe((data) => {
      this.reset();
    });
    this.sericeDatePicker.addSubscription(clear);
  }

  public reset() {
    this.date.clearTitle();
    let date = new Date();
    this.navDate = this.sericeDatePicker.getNavDate(date);
    this.datepicker = this.sericeDatePicker.getDateForDatePicker(date);
    this.date.setTitle(this.datepicker, this.formatDate);
  }
  /**
  * Subscribe to edit mode
  */
  private onInitEditMode() {
    let edit = this.stateDatePicker.getOnEditMode().subscribe((data: number) => {
      this.setEditDate(data);
    })
    this.sericeDatePicker.addSubscription(edit);
  }
  public setEditDate(data: number) {
    let date = new Date(data);
    this.navDate = this.sericeDatePicker.getNavDate(date);
    this.datepicker = this.sericeDatePicker.getDateForDatePicker(data);
    if (this.navDate) this.sericeDatePicker.updateMonthAndYearDatePicker(this.datepicker, this.navDate);
    this.date.setTitle(this.datepicker, this.formatDate);
  }

  public geTextDate() {
    return this.date.getTitle();
  }
  /**
  * Subscribe to reset data
  */
  private oninitreset() {
    let reset = this.stateDatePicker.getOnReset().subscribe((data) => {
      this.selectDate(this.sericeDatePicker.getDateForDatePicker(null));
    })
    this.sericeDatePicker.addSubscription(reset);
  }

  /**
  * Set date
  * @param data - date
  */
  public selectDate(data: NgbDate) {
    this.datepicker = data;
    if (this.navDate) this.sericeDatePicker.updateMonthAndYearDatePicker(this.datepicker, this.navDate);
    this.date.setTitle(this.datepicker, this.formatDate);

    if (this.type === TYPE_INPUT) this.sericeDatePicker.setTextInput('dropdownDate', this.date.getTitle());
    this.onChange.emit(new ChangeDatePicker(this.datepicker.day, this.datepicker.month, this.datepicker.year));
    this.date_dropDown.close();
    this.cd.detectChanges();

  }


  /**
   * Set tomorrow date
   */
  public selectTomorrow() {
    let date = this.calendar.getToday();
    date.day++;
    this.datepicker = date;
    if (this.navDate) this.sericeDatePicker.updateMonthAndYearDatePicker(this.datepicker, this.navDate);
    this.updateDate();
  }

  /**
   * Set today date
   */
  public selectToday() {
    this.datepicker = this.calendar.getToday();
    if (this.navDate) this.sericeDatePicker.updateMonthAndYearDatePicker(this.datepicker, this.navDate);
    this.updateDate();
  }

  /**
  * Update  date
  */
  private updateDate() {
    this.date.setTitle(this.datepicker, this.formatDate);
    this.onChange.emit(new ChangeDatePicker(this.datepicker.day, this.datepicker.month, this.datepicker.year));
    if (this.type === TYPE_INPUT) this.sericeDatePicker.setTextInput('dropdownDate', this.date.getTitle());
    this.date_dropDown.close();
  }

  public getDropDown() {
    return this.date_dropDown;
  }

  /**
  * Set first day in month
  */
  public selectStartMonth() {
    let date = this.calendar.getToday();
    date.day = 1;
    this.datepicker = date;
    if (this.navDate) this.sericeDatePicker.updateMonthAndYearDatePicker(this.datepicker, this.navDate);
    this.updateDate();
  }

  /**
   * Set last day in month
   */
  public selectEndMonth() {
    // let date = this.calendar.getToday();
    let date = this.calendar.getToday();
    date.day = 31;
    this.datepicker = date;
    if (this.navDate) this.sericeDatePicker.updateMonthAndYearDatePicker(this.datepicker, this.navDate);
    this.updateDate();
  }

  /**
  * Set date
  * @param data - date vent
  */
  public navigateDate(data: NgbDatepickerNavigateEvent) {
    this.navDate = data;
  }

  ngOnDestroy(): void {
    this.sericeDatePicker.clearSubscriptions();
  }
}
