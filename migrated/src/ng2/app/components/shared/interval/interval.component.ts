import { Component, OnInit, OnChanges, Input, Output, EventEmitter, SimpleChanges, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CronOptions } from 'src/ng2/app/components/shared/interval/interfaces/cron/cront-option';
import { Days, MonthWeeks, Months } from './config/enums';
import { IntervalService } from './services/interval.service';
import { NgbDateStruct, NgbCalendar, NgbDate, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
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
  @Input() valid: boolean = true;
  @Input() get cron(): string { return this.localCron; }
  set cron(value: string) {
    this.localCron = value;
    this.cronChange.emit(this.localCron);
  }
 
  @Output() cronChange = new EventEmitter();

  public activeTab: string = 'daily';
  public selectOptions;
  public state: any;
  private localCron: string;
  public navDate: any;

  /**
   * Creates an instance of the IntervalComponent with the injected services
   * @param {IntervalService} intervalService Service to work with interval
   * @param {ChangeDetectorRef} cd Service to work with change detecto
   * @param {IntervalStateService} stateInterval to work interval state
   * @param {RecurringTicketsStateService} recurringState to work recurring tickets state
   */
  constructor(private intervalService: IntervalService,
    public cd: ChangeDetectorRef,
    private stateInterval: IntervalStateService,
    private recurringState: RecurringTicketsStateService,
  ) {

  }

  /**
   * Initializes quotes. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  public async ngOnInit() {
    this.datepicker = this.stateInterval.getDefaultDate();
    this.options = this.intervalService.getDefaultOptions();
    this.state = this.intervalService.getDefaultState();
    this.onCheckClear();
    this.onInitEditMode();
    this.selectOptions = this.intervalService.getSelectOptions();

  }

  /**
   * Set date for edit
   * @param data date
   */
  public selectDateEditMode(data: NgbDate) {
    this.datepicker = data;
    if (this.navDate) this.intervalService.updateMonthAndYearDatePicker(this.datepicker, this.navDate);

  }

   /**
   * Subscribe for edit mode
   */
  private onInitEditMode() {
    let getEditMode = this.stateInterval.getEditMode().subscribe((data) => {
      this.title = this.recurringState.getTypeCron(data);
      this.activeTab = this.title.toLowerCase();
      if (this.activeTab === "weekly") {
        this.selectOptions.days.forEach(weekDay => this.state.weekly[weekDay] = false);
        this.selectOptions.days.forEach(weekDay => this.state.daily[weekDay] = false);
        let weekly = data.substring(10, 13);
        this.state.weekly[weekly] = true;
      }
      if (this.activeTab === "daily") {
        this.selectOptions.days.forEach(weekDay => this.state.weekly[weekDay] = false);
        this.selectOptions.days.forEach(weekDay => this.state.daily[weekDay] = false);
        let daily = data.substring(10, data.lastIndexOf(" *")).split(",");
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
          this.navDate = this.intervalService.geDefaultNavDate();
          this.selectDateEditMode(this.intervalService.getDateForDatePicker(day));
        }
      }
    });
    this.intervalService.addSubscription(getEditMode);
  }

/**
   * Set active tab
   * @param tab active tab
   * @param event event
   */
  public setActiveTab(tab: string, event: any) {
    if (!this.disabled) {
      this.activeTab = tab;
      this.title = tab.charAt(0).toUpperCase() + tab.slice(1);
      //  this.regenerateCron();
    }
  }

  /**
   * Subscribe for clear data
   */
  private onCheckClear() {
    let getClearState = this.stateInterval.getClearState().subscribe(() => {
      this.activeTab = 'daily';
      this.title = 'Daily';
      this.options = this.intervalService.getDefaultOptions();
      this.state = this.intervalService.getDefaultState();
      this.datepicker = this.stateInterval.getDefaultDate();

    })
    this.intervalService.addSubscription(getClearState);
  }

   /**
   * Set cron
   */
  public regenerateCron() {

    switch (this.activeTab) {

      case "weekly":
        const days_weekly = this.selectOptions.days
          .reduce((acc, day) => this.state.weekly[day] ? acc.concat([day]) : acc, [])
          .join(",");
        

        this.cron = `0 0 0 ? * ${days_weekly} *`.trim();
        if (days_weekly === '') this.cron = null;
        this.selectOptions.days.forEach(weekDay => this.state.daily[weekDay] = false);
        this.datepicker = this.stateInterval.getDefaultDate();
        break;
      case "daily":
        const days = this.selectOptions.days
          .reduce((acc, day) => this.state.daily[day] ? acc.concat([day]) : acc, [])
          .join(",");
       

        this.cron = `0 0 0 ? * ${days} *`.trim();
        if (days === '') this.cron = null;
        this.selectOptions.days.forEach(weekDay => this.state.weekly[weekDay] = false);
        this.datepicker = this.stateInterval.getDefaultDate();
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

   /**
   * Set weekly
   * @param weekly weekly
   */
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

   /**
   * Set date
   * @param data date
   */
  public selectDate(data: NgbDate) {
    // this.datepicker = this.stateInterval.getDefaultDate();
    this.datepicker.day = data.day;
    this.cd.detectChanges();
    this.regenerateCron();
  }

  /**
   * Set first day in month
   */
  public selectStartMonth() {
    let date = this.stateInterval.getDefaultDate();
    date.day = 1;
    this.datepicker = date;
    this.regenerateCron();

  }

/**
   * Set last day in month
   */
  public selectEndMonth() {
   // let date = this.calendar.getToday();
    let date = this.stateInterval.getDefaultDate();
    date.day = 31;
    this.datepicker = date;
    this.regenerateCron();
  }
  ngOnDestroy(): void {
    this.intervalService.clearSubscriptions();
  }

}
