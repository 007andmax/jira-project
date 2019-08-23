import { Component, OnInit, ViewChild, ChangeDetectorRef, ElementRef, EventEmitter, Output, OnDestroy } from '@angular/core';
import { NgbDropdown, NgbDateStruct, NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { RecurringTicketsEditAsideDate } from '../../tickets/recurring-tickets/class/recurring-tickets-edit-aside-date';
import { DatePickerStateService } from './services/date-picker-state.service';
import { ChangeDatePicker } from './class/change-date-picker';
import { NgbDatepickerNavigateEvent } from '@ng-bootstrap/ng-bootstrap/datepicker/datepicker';
import { DatePickerService } from './services/date-picker.service';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
  providers: [DatePickerService]
})
export class DatePickerComponent implements OnInit, OnDestroy {

  @ViewChild('date') date_dropDown: NgbDropdown;
 
  @Output() onChange: EventEmitter<ChangeDatePicker> = new EventEmitter();
  public datepicker: NgbDateStruct;
  public date: RecurringTicketsEditAsideDate = new RecurringTicketsEditAsideDate();
  public navDate: any;
  public minDate:NgbDateStruct;
  constructor(private calendar: NgbCalendar,
    public cd: ChangeDetectorRef,

    private stateDatePicker: DatePickerStateService,
    private sericeDatePicker: DatePickerService) { }

  ngOnInit() {
    this.minDate = this.calendar.getToday();;
    this.oninitreset();
    this.onInitEditMode();
    this.oninitClear();

  }
  private oninitClear() {
    let clear = this.stateDatePicker.getOnClear().subscribe((data) => {
      this.date.clearTitle();
      this.navDate = null;
    });
    this.sericeDatePicker.addSubscription(clear);
  }
  private onInitEditMode() {
    let edit = this.stateDatePicker.getOnEditMode().subscribe((data: number) => {
      let date = new Date(data);
      this.navDate = this.sericeDatePicker.getNavDate(date);
      this.datepicker = this.sericeDatePicker.getDateForDatePicker(data);
      if (this.navDate) this.sericeDatePicker.updateMonthAndYearDatePicker(this.datepicker, this.navDate);
      this.date.setTitle(this.datepicker);
      this.sericeDatePicker.setTextInput('dropdownDate', this.date.getTitle());
    })
    this.sericeDatePicker.addSubscription(edit);
  }
  private oninitreset() {
    let reset = this.stateDatePicker.getOnReset().subscribe((data) => {
      console.log('oninitreset');
      this.selectDate(this.sericeDatePicker.getDateForDatePicker(null));
    })
    this.sericeDatePicker.addSubscription(reset);
  }

  public selectDate(data: NgbDate) {
    this.datepicker = data;
    if (this.navDate) this.sericeDatePicker.updateMonthAndYearDatePicker(this.datepicker, this.navDate);
    this.date.setTitle(this.datepicker);

    this.sericeDatePicker.setTextInput('dropdownDate', this.date.getTitle());
    this.onChange.emit(new ChangeDatePicker(this.datepicker.day, this.datepicker.month, this.datepicker.year));
    // this.recurringState.getCreateTicket().setStartDate(this.datepicker.day, this.datepicker.month, this.datepicker.year, this.recurringState.getTehCompany().addresses[0].timeZone.timeOffset);
    this.date_dropDown.close();
    this.cd.detectChanges();

  }


  public selectTomorrow() {
    let date = this.calendar.getToday();
    date.day++;
    this.datepicker = date;
    if (this.navDate) this.sericeDatePicker.updateMonthAndYearDatePicker(this.datepicker, this.navDate);
    this.updateDate();
  }

  public selectToday() {
    this.datepicker = this.calendar.getToday();
    if (this.navDate) this.sericeDatePicker.updateMonthAndYearDatePicker(this.datepicker, this.navDate);
    this.updateDate();
  }
  private updateDate() {
    this.date.setTitle(this.datepicker);

    this.onChange.emit(new ChangeDatePicker(this.datepicker.day, this.datepicker.month, this.datepicker.year));
    this.sericeDatePicker.setTextInput('dropdownDate', this.date.getTitle());
    this.date_dropDown.close();
  }
  public selectStartMonth() {
    let date = this.calendar.getToday();
    date.day = 1;
    this.datepicker = date;
    if (this.navDate) this.sericeDatePicker.updateMonthAndYearDatePicker(this.datepicker, this.navDate);
    this.updateDate();

  }
  public selectEndMonth() {
    // let date = this.calendar.getToday();
     let date = this.calendar.getToday();
     date.day = 31;
     this.datepicker = date;
     if (this.navDate) this.sericeDatePicker.updateMonthAndYearDatePicker(this.datepicker, this.navDate);
     this.updateDate();
   }
  public navigateDate(data: NgbDatepickerNavigateEvent) {
    this.navDate = data;
  }

  ngOnDestroy(): void {
    this.sericeDatePicker.clearSubscriptions();
  }
}
