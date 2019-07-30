import { Component, OnInit, OnChanges, Input, Output, EventEmitter, SimpleChanges, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CronOptions } from 'src/ng2/app/components/shared/interval/interfaces/cron/cront-option';
import { Days, MonthWeeks, Months } from './config/enums';
import { IntervalService } from './services/interval.service';
import { NgbDateStruct, NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { NgbDatepickerNavigateEvent } from '@ng-bootstrap/ng-bootstrap/datepicker/datepicker';
import { IntervalStateService } from './services/interval-state.service';
import { RecurringTicketsStateService } from '../../tickets/recurring-tickets/services/recurring-tickets-state.service';


@Component({
  selector: 'app-interval',
  templateUrl: './interval.component.html',
  styleUrls: ['./interval.component.scss'],
  providers: [IntervalService]
})
export class IntervalComponent implements OnInit, OnDestroy {

  public disabled: boolean = false;
  public options: CronOptions;
  public datepicker: NgbDateStruct;
  public navigation = 'none';
  public outsideDays = 'hidden';
  public title: string = 'Daily';

  @Input() get cron(): string { return this.localCron; }
  set cron(value: string) {
    this.localCron = value;
    this.cronChange.emit(this.localCron);
  }
  // the name is an Angular convention, @Input variable name + "Change" suffix
  @Output() cronChange = new EventEmitter();

  public activeTab: string = 'daily';
  public selectOptions;
  public state: any;
  private localCron: string;
  public navDate: any;
  constructor(private intervalService: IntervalService,
    public cd: ChangeDetectorRef,
    private calendar: NgbCalendar,
    private stateInterval: IntervalStateService,
    private recurringState: RecurringTicketsStateService) {

  }
  public async ngOnInit() {
    this.options = this.intervalService.getDefaultOptions();
    this.state = this.intervalService.getDefaultState();
    this.onCheckClear();
    this.onInitEditMode();
    this.selectOptions = this.intervalService.getSelectOptions();

  }
  public selectDateEditMode(data: NgbDate) {
    this.datepicker = data;
    if (this.navDate) this.intervalService.updateMonthAndYearDatePicker(this.datepicker, this.navDate);

  }
  private onInitEditMode() {
    let getEditMode = this.stateInterval.getEditMode().subscribe((data) => {
      this.title = this.recurringState.getTypeCron(data);
      this.activeTab = this.title.toLowerCase();
      if (this.activeTab === "weekly") {
        this.selectOptions.days.forEach(weekDay => this.state.weekly[weekDay] = false);
        this.selectOptions.days.forEach(weekDay => this.state.daily[weekDay] = false);
        let weekly = data.substring(10, 13);
        console.log('weekly', weekly);
        this.state.weekly[weekly] = true;
      }
      if (this.activeTab === "daily") {
        this.selectOptions.days.forEach(weekDay => this.state.weekly[weekDay] = false);
        this.selectOptions.days.forEach(weekDay => this.state.daily[weekDay] = false);
        let daily = data.substring(10, data.lastIndexOf(" *")).split(",");
        console.log('daily', daily);
        daily.forEach((item) => this.state.daily[item] = true);
        
      }
      if (this.activeTab === "monthly") {
        this.selectOptions.days.forEach(weekDay => this.state.weekly[weekDay] = false);
        this.selectOptions.days.forEach(weekDay => this.state.daily[weekDay] = false);
        if (data === "0 0 0 L * ? *") {
          this.navDate = this.intervalService.geDefaultNavDate();
          this.selectDateEditMode(this.intervalService.getDateForDatePicker(31));
        } else {
          let day = Number(data.substring(6, 8));
          console.log('day', day);
          this.navDate = this.intervalService.geDefaultNavDate();
          this.selectDateEditMode(this.intervalService.getDateForDatePicker(day));
        }
      }
      console.log('this.state', this.state);
    });
    this.intervalService.addSubscription(getEditMode);
  }


  public setActiveTab(tab: string, event: any) {
    if (!this.disabled) {
      this.activeTab = tab;
      this.title = tab.charAt(0).toUpperCase() + tab.slice(1);
      //  this.regenerateCron();
    }
  }
  private onCheckClear() {
    let getClearState = this.stateInterval.getClearState().subscribe(() => {
      this.activeTab = 'daily';
      this.title = 'Daily';
      this.options = this.intervalService.getDefaultOptions();
      this.state = this.intervalService.getDefaultState();
      this.datepicker = null;

    })
    this.intervalService.addSubscription(getClearState);
  }
  public regenerateCron() {
  
    switch (this.activeTab) {

      case "weekly":
        const days_weekly = this.selectOptions.days
          .reduce((acc, day) => this.state.weekly[day] ? acc.concat([day]) : acc, [])
          .join(",");
        this.cron = `0 0 0 ? * ${days_weekly} *`.trim();
        this.selectOptions.days.forEach(weekDay => this.state.daily[weekDay] = false);
        this.datepicker = null;
        break;
      case "daily":
        const days = this.selectOptions.days
          .reduce((acc, day) => this.state.daily[day] ? acc.concat([day]) : acc, [])
          .join(",");
        this.cron = `0 0 0 ? * ${days} *`.trim();
        this.selectOptions.days.forEach(weekDay => this.state.weekly[weekDay] = false);
        this.datepicker = null;
        break;
      case "monthly":
        if (this.datepicker.day <= 28) this.cron = `0 0 0 ${this.datepicker.day} JAN-DEC ? *`;
        if (this.datepicker.day === 29 || this.datepicker.day === 30) this.cron = `0 0 0 ${this.datepicker.day} JAN,MAR-DEC ? *`;
        if (this.datepicker.day === 31) this.cron = `0 0 0 L * ? *`;
        this.selectOptions.days.forEach(weekDay => this.state.daily[weekDay] = false);
        this.selectOptions.days.forEach(weekDay => this.state.weekly[weekDay] = false);
        break;

    }

  }

  public setWeekly(weekly) {
    for (let i in this.state.weekly) {
      if (i === 'FRI' || i === 'MON' || i === 'SAT' || i === 'SUN' || i === 'THU' || i === 'TUE' || i === 'WED') {
        if (i === weekly) {
          this.state.weekly[i] = true;
        } else {
          this.state.weekly[i] = false;
        }
      }

    }
    this.regenerateCron();
  }

  public selectDate(data: NgbDate) {
    this.datepicker = data;

    this.cd.detectChanges();
    this.regenerateCron();
  }


  public selectStartMonth() {
    let date = this.calendar.getToday();
    date.day = 1;
    this.datepicker = date;
    this.regenerateCron();

  }


  public selectEndMonth() {
    let date = this.calendar.getToday();
    let day = 32 - new Date(date.year, date.month - 1, 32).getDate();
    date.day = day;
    this.datepicker = date;
    this.regenerateCron();
  }
  ngOnDestroy(): void {
    this.intervalService.clearSubscriptions();
  }

}
