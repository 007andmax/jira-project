import { Component, OnInit, ViewChild, ChangeDetectorRef, ElementRef, EventEmitter, Output, OnDestroy, Input } from '@angular/core';
import { NgbDropdown, NgbDateStruct, NgbCalendar, NgbDate, NgbDropdownModule, NgbTooltipModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { RecurringTicketsEditAsideDate } from '../../tickets/recurring-tickets/class/recurring-tickets-edit-aside-date';
import { DatePickerStateService } from './services/date-picker-state.service';
import { ChangeDatePicker } from './class/change-date-picker';
import { NgbDatepickerNavigateEvent } from '@ng-bootstrap/ng-bootstrap/datepicker/datepicker';
import { DatePickerService } from './services/date-picker.service';
import { TYPE_INPUT, FORMAT_DATE_1 } from 'src/app/const/date-picker';
import * as moment from 'moment';
import { FormsModule } from '@angular/forms';
import { DynamicTooltipComponent } from '../dynamic-tooltip/dynamic-tooltip.component';
import { NgIf, NgClass } from '@angular/common';

@Component({
    selector: 'app-date-picker',
    templateUrl: './date-picker.component.html',
    styleUrls: ['./date-picker.component.scss'],
    providers: [DatePickerService],
    standalone: true,
    imports: [NgbDropdownModule, NgIf, DynamicTooltipComponent, NgbTooltipModule, NgClass, NgbDatepickerModule, FormsModule]
})
export class DatePickerComponent implements OnInit, OnDestroy {

  @ViewChild('date', { static: true }) date_dropDown: NgbDropdown;
  @Input() type: string = TYPE_INPUT;
  @Input() formatDate: string = FORMAT_DATE_1;
  @Input() editMode: boolean = false;
  @Input() fromDate: number = 0;
  @Input() editDate: number = 0;
  @Input() useMinDate: boolean = true;
  @Input() useMaxDate: boolean = false;
  @Input() minDate: number = new Date().getTime();
  @Input() maxDate: number = new Date().getTime();
  @Input() placement: string = "bottom";
  @Input() isDisabled: boolean = false;
  @Input() container: string;
  @Input() placeholder: string = "Select Date";
  @Input() dropdownClass = [];
  @Output() onChange: EventEmitter<ChangeDatePicker> = new EventEmitter();
  public selectedDateModel = null;
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
  constructor(public calendar: NgbCalendar,
    public cd: ChangeDetectorRef,
    public stateDatePicker: DatePickerStateService,
    public sericeDatePicker: DatePickerService) { }


  /**
 * Initializes date picker. See [ngOnInit]{@see OnInit#ngOnInit}
 */
  ngOnInit() {


    // if (this.useMinDate) this.minDateDP = this.sericeDatePicker.getDateStruct(this.minDate);
    //  if (this.useMaxDate) this.maxDateDP = this.sericeDatePicker.getDateStruct(this.maxDate);

    this.oninitreset();
    this.onInitEditMode();
    this.oninitClear();

    if (this.editMode && this.editDate) this.setEditDate(this.editDate);

  }
  ngDoCheck() {
    if (this.useMinDate) this.minDateDP = this.sericeDatePicker.getDateStruct(this.minDate);
    if (this.useMaxDate) this.maxDateDP = this.sericeDatePicker.getDateStruct(this.maxDate);

  }
  toogleDropdown() {
    if (this.type === 'DETAIL_TICKET_UPDATE' || this.type === 'COMPANY_DEVICE') {
      this.date_dropDown.open();
    }
  }

  /**
  * Subscribe to clear date picker
  */
  public oninitClear() {
    let clear = this.stateDatePicker.getOnClear().subscribe((data) => {
      this.reset();
    });
    this.sericeDatePicker.addSubscription(clear);
  }
  public clear() {
    this.reset();
    this.editDate = 0;
    this.selectedDateModel = null;
    this.onChange.emit(null);
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
  public onInitEditMode() {
    let edit = this.stateDatePicker.getOnEditMode().subscribe((data: number) => {
      this.setEditDate(data);
    })
    this.sericeDatePicker.addSubscription(edit);
  }
  public setEditDate(data: number) {
    let date = new Date(data);
    if ((this.type === 'DETAIL_TICKET_UPDATE' || this.type === 'COMPANY_DEVICE') && this.editDate == 0) date = new Date();
    this.navDate = this.sericeDatePicker.getNavDate(date);
    this.datepicker = this.sericeDatePicker.getDateForDatePicker(data);
    if (this.navDate) this.sericeDatePicker.updateMonthAndYearDatePicker(this.datepicker, this.navDate);
    this.date.setTitle(this.datepicker, this.formatDate);
    this.selectedDateModel = (this.editDate == 0) ? null : date.toString();
  }

  public geTextDate() {
    if ((this.type === 'DETAIL_TICKET_UPDATE' || this.type === 'COMPANY_DEVICE') && (this.editDate == 0 || !this.editDate)) return '';
    if (this.type === 'DETAIL_TICKET' || this.type === 'DETAIL_TICKET_UPDATE' || this.type === 'COMPANY_DEVICE') return moment(new Date(this.date.getTitle())).format('DD MMM, YYYY');
    return this.date.getTitle();
  }
  /**
  * Subscribe to reset data
  */
  public oninitreset() {
    let reset = this.stateDatePicker.getOnReset().subscribe((data) => {
      if (this.editMode) this.setEditDate(this.editDate);
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
    this.selectedDateModel = `${this.datepicker.year}/${this.datepicker.month}/${this.datepicker.day}`
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
    this.selectedDateModel = `${this.datepicker.year}/${this.datepicker.month}/${this.datepicker.day}`
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
    if (this.sericeDatePicker) this.sericeDatePicker.clearSubscriptions();
  }
}
