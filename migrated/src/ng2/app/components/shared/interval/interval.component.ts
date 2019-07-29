import { Component, OnInit, OnChanges, Input, Output, EventEmitter, SimpleChanges, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CronOptions } from 'src/ng2/app/components/shared/interval/interfaces/cron/cront-option';
import { Days, MonthWeeks, Months } from './config/enums';
import { IntervalService } from './services/interval.service';
import { NgbDateStruct, NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { NgbDatepickerNavigateEvent } from '@ng-bootstrap/ng-bootstrap/datepicker/datepicker';
import { IntervalStateService } from './services/interval-state.service';


@Component({
  selector: 'app-interval',
  templateUrl: './interval.component.html',
  styleUrls: ['./interval.component.scss'],
  providers: [IntervalService]
})
export class IntervalComponent implements OnInit, OnChanges,OnDestroy {
 
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
  public selectOptions = this.getSelectOptions();
  public state: any;

  private localCron: string;
 // private isDirty: boolean;

  get isCronFlavorQuartz() { return this.options.cronFlavor === 'quartz'; }
  get isCronFlavorStandard() { return this.options.cronFlavor === 'standard'; }

  get yearDefaultChar() { return this.options.cronFlavor === 'quartz' ? "*" : ""; }
  get weekDayDefaultChar() { return this.options.cronFlavor === 'quartz' ? "?" : "*"; }
  get monthDayDefaultChar() { return this.options.cronFlavor === 'quartz' ? "?" : "*"; }
  constructor(private intervalService: IntervalService,
    public cd: ChangeDetectorRef,
    private calendar: NgbCalendar,
    private stateInterval: IntervalStateService,) {
    this.datepicker = this.calendar.getToday();
  }
  public async ngOnInit() {
    this.options = this.intervalService.getDefaultOptions();
    this.state = this.getDefaultState();
    this.onCheckClear();
  }

  public async ngOnChanges(changes: SimpleChanges) {
    const newCron = changes["cron"];
    if (newCron && !newCron.firstChange) {
      this.handleModelChange(this.cron);
    }
  }

  public setActiveTab(tab: string, event: any) {
    event; // makes the compiler happy
    if (!this.disabled) {
      this.activeTab = tab;
      this.title = tab.charAt(0).toUpperCase() + tab.slice(1);
      this.regenerateCron();
    }
  }
  private onCheckClear() {
    console.log('onCheckClear 111');
  let getClearState =  this.stateInterval.getClearState().subscribe(() => {
      console.log('onCheckClear');
      this.activeTab = 'daily';
      this.title = 'Daily';
      this.options = this.intervalService.getDefaultOptions();
      this.state = this.getDefaultState();
      this.datepicker = this.calendar.getToday();

    })
    this.intervalService.addSubscription(getClearState);
  }
  public regenerateCron() {
    console.log('regenerateCron', this.datepicker);
   // this.isDirty = true;

    switch (this.activeTab) {

      case "weekly":
        const days_weekly = this.selectOptions.days
          .reduce((acc, day) => this.state.weekly[day] ? acc.concat([day]) : acc, [])
          .join(",");
        this.cron = `${this.isCronFlavorQuartz ? this.state.weekly.seconds : ''} ${this.state.weekly.minutes} ${this.hourToCron(this.state.weekly.hours, this.state.weekly.hourType)} ${this.monthDayDefaultChar} * ${days_weekly} ${this.yearDefaultChar}`.trim();
        break;
      case "daily":
        const days = this.selectOptions.days
          .reduce((acc, day) => this.state.daily[day] ? acc.concat([day]) : acc, [])
          .join(",");
        this.cron = `${this.isCronFlavorQuartz ? this.state.daily.seconds : ''} ${this.state.daily.minutes} ${this.hourToCron(this.state.daily.hours, this.state.daily.hourType)} ${this.monthDayDefaultChar} * ${days} ${this.yearDefaultChar}`.trim();
        break;
      case "monthly":
        if (this.datepicker.day <= 28) this.cron = `0 0 0 ${this.datepicker.day} JAN-DEC ? *`;
        if (this.datepicker.day === 29 || this.datepicker.day === 30) this.cron = `0 0 0 ${this.datepicker.day} JAN,MAR-DEC ? *`;
        if (this.datepicker.day === 31) this.cron = `0 0 0 L * ? *`;
        break;

    }

  }

  private getAmPmHour(hour: number) {
    return this.options.use24HourTime ? hour : (hour + 11) % 12 + 1;
  }

  private getHourType(hour: number) {
    return this.options.use24HourTime ? undefined : (hour >= 12 ? "PM" : "AM");
  }

  private hourToCron(hour: number, hourType: string) {
    if (this.options.use24HourTime) {
      return hour;
    } else {
      return hourType === "AM" ? (hour === 12 ? 0 : hour) : (hour === 12 ? 12 : hour + 12);
    }
  }
  

  private handleModelChange(cron: string) {
    /*if (this.isDirty) {
      this.isDirty = false;
      return;
    } else {
      this.isDirty = false;
    }*/

    if (!this.cronIsValid(cron)) {
      if (this.isCronFlavorQuartz)
        throw "Invalid cron expression, there must be 6 or 7 segments";

      if (this.isCronFlavorStandard)
        throw "Invalid cron expression, there must be 5 segments";
    }

    var origCron: string = cron;
    if (cron.split(" ").length === 5 && this.isCronFlavorStandard)
      cron = `0 ${cron} *`;

    const [seconds, minutes, hours, dayOfMonth, month, dayOfWeek] = cron.split(" ");

    if (cron.match(/\d+ 0\/\d+ \* 1\/1 \* [\?\*] \*/)) {
      this.activeTab = "minutes";

      this.state.minutes.minutes = parseInt(minutes.substring(2));
      this.state.minutes.seconds = parseInt(seconds);
    } else if (cron.match(/\d+ \d+ 0\/\d+ 1\/1 \* [\?\*] \*/)) {
      this.activeTab = "hourly";

      this.state.hourly.hours = parseInt(hours.substring(2));
      this.state.hourly.minutes = parseInt(minutes);
      this.state.hourly.seconds = parseInt(seconds);
    } else if (cron.match(/\d+ \d+ \d+ 1\/\d+ \* [\?\*] \*/)) {
      this.activeTab = "daily";

      this.state.daily.subTab = "everyDays";
      this.state.daily.everyDays.days = parseInt(dayOfMonth.substring(2));
      const parsedHours = parseInt(hours);
      this.state.daily.everyDays.hours = this.getAmPmHour(parsedHours);
      this.state.daily.everyDays.hourType = this.getHourType(parsedHours);
      this.state.daily.everyDays.minutes = parseInt(minutes);
      this.state.daily.everyDays.seconds = parseInt(seconds);
    } else if (cron.match(/\d+ \d+ \d+ [\?\*] \* MON-FRI \*/)) {
      this.activeTab = "daily";

      this.state.daily.subTab = "everyWeekDay";
      const parsedHours = parseInt(hours);
      this.state.daily.everyWeekDay.hours = this.getAmPmHour(parsedHours);
      this.state.daily.everyWeekDay.hourType = this.getHourType(parsedHours);
      this.state.daily.everyWeekDay.minutes = parseInt(minutes);
      this.state.daily.everyWeekDay.seconds = parseInt(seconds);
    } else if (cron.match(/\d+ \d+ \d+ [\?\*] \* (MON|TUE|WED|THU|FRI|SAT|SUN)(,(MON|TUE|WED|THU|FRI|SAT|SUN))* \*/)) {
      this.activeTab = "weekly";
      this.selectOptions.days.forEach(weekDay => this.state.weekly[weekDay] = false);
      dayOfWeek.split(",").forEach(weekDay => this.state.weekly[weekDay] = true);
      const parsedHours = parseInt(hours);
      this.state.weekly.hours = this.getAmPmHour(parsedHours);
      this.state.weekly.hourType = this.getHourType(parsedHours);
      this.state.weekly.minutes = parseInt(minutes);
      this.state.weekly.seconds = parseInt(seconds);
    } else if (cron.match(/\d+ \d+ \d+ (\d+|L|LW|1W) 1\/\d+ [\?\*] \*/)) {
      this.activeTab = "monthly";
      this.state.monthly.subTab = "specificDay";
      this.state.monthly.specificDay.day = dayOfMonth;
      this.state.monthly.specificDay.months = parseInt(month.substring(2));
      const parsedHours = parseInt(hours);
      this.state.monthly.specificDay.hours = this.getAmPmHour(parsedHours);
      this.state.monthly.specificDay.hourType = this.getHourType(parsedHours);
      this.state.monthly.specificDay.minutes = parseInt(minutes);
      this.state.monthly.specificDay.seconds = parseInt(seconds);
    } else if (cron.match(/\d+ \d+ \d+ [\?\*] 1\/\d+ (MON|TUE|WED|THU|FRI|SAT|SUN)((#[1-5])|L) \*/)) {
      const day = dayOfWeek.substr(0, 3);
      const monthWeek = dayOfWeek.substr(3);
      this.activeTab = "monthly";
      this.state.monthly.subTab = "specificWeekDay";
      this.state.monthly.specificWeekDay.monthWeek = monthWeek;
      this.state.monthly.specificWeekDay.day = day;
      this.state.monthly.specificWeekDay.months = parseInt(month.substring(2));
      const parsedHours = parseInt(hours);
      this.state.monthly.specificWeekDay.hours = this.getAmPmHour(parsedHours);
      this.state.monthly.specificWeekDay.hourType = this.getHourType(parsedHours);
      this.state.monthly.specificWeekDay.minutes = parseInt(minutes);
      this.state.monthly.specificWeekDay.seconds = parseInt(seconds);
    } else if (cron.match(/\d+ \d+ \d+ (\d+|L|LW|1W) \d+ [\?\*] \*/)) {
      this.activeTab = "yearly";
      this.state.yearly.subTab = "specificMonthDay";
      this.state.yearly.specificMonthDay.month = parseInt(month);
      this.state.yearly.specificMonthDay.day = dayOfMonth;
      const parsedHours = parseInt(hours);
      this.state.yearly.specificMonthDay.hours = this.getAmPmHour(parsedHours);
      this.state.yearly.specificMonthDay.hourType = this.getHourType(parsedHours);
      this.state.yearly.specificMonthDay.minutes = parseInt(minutes);
      this.state.yearly.specificMonthDay.seconds = parseInt(seconds);
    } else if (cron.match(/\d+ \d+ \d+ [\?\*] \d+ (MON|TUE|WED|THU|FRI|SAT|SUN)((#[1-5])|L) \*/)) {
      const day = dayOfWeek.substr(0, 3);
      const monthWeek = dayOfWeek.substr(3);
      this.activeTab = "yearly";
      this.state.yearly.subTab = "specificMonthWeek";
      this.state.yearly.specificMonthWeek.monthWeek = monthWeek;
      this.state.yearly.specificMonthWeek.day = day;
      this.state.yearly.specificMonthWeek.month = parseInt(month);
      const parsedHours = parseInt(hours);
      this.state.yearly.specificMonthWeek.hours = this.getAmPmHour(parsedHours);
      this.state.yearly.specificMonthWeek.hourType = this.getHourType(parsedHours);
      this.state.yearly.specificMonthWeek.minutes = parseInt(minutes);
      this.state.yearly.specificMonthWeek.seconds = parseInt(seconds);
    } else {
      this.activeTab = "advanced";
      this.state.advanced.expression = origCron;
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

  private cronIsValid(cron: string): boolean {
    if (cron) {
      const cronParts = cron.split(" ");
      return (this.isCronFlavorQuartz && (cronParts.length === 6 || cronParts.length === 7) || (this.isCronFlavorStandard && cronParts.length === 5));
    }
    return false;
  }

  private getDefaultState() {
    const [defaultHours, defaultMinutes, defaultSeconds] = this.options.defaultTime.split(":").map(Number);

    return {
      daily: {
        MON: true,
        TUE: false,
        WED: false,
        THU: false,
        FRI: false,
        SAT: false,
        SUN: false,
        hours: this.getAmPmHour(defaultHours),
        minutes: defaultMinutes,
        seconds: defaultSeconds,
        hourType: this.getHourType(defaultHours)
      },
      weekly: {
        MON: true,
        TUE: false,
        WED: false,
        THU: false,
        FRI: false,
        SAT: false,
        SUN: false,
        hours: this.getAmPmHour(defaultHours),
        minutes: defaultMinutes,
        seconds: defaultSeconds,
        hourType: this.getHourType(defaultHours)
      },
      monthly: {
        subTab: "specificDay",
        specificDay: {
          day: "1",
          months: 1,
          hours: this.getAmPmHour(defaultHours),
          minutes: defaultMinutes,
          seconds: defaultSeconds,
          hourType: this.getHourType(defaultHours)
        },
        specificWeekDay: {
          monthWeek: "#1",
          day: "MON",
          months: 1,
          hours: this.getAmPmHour(defaultHours),
          minutes: defaultMinutes,
          seconds: defaultSeconds,
          hourType: this.getHourType(defaultHours)
        }
      }
    };
  }



  private getSelectOptions() {
    return {
      months: this.getRange(1, 12),
      monthWeeks: ["#1", "#2", "#3", "#4", "#5", "L"],
      days: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
      minutes: this.getRange(0, 59),
      fullMinutes: this.getRange(0, 59),
      seconds: this.getRange(0, 59),
      hours: this.getRange(1, 23),
      monthDays: this.getRange(1, 31),
      monthDaysWithLasts: ["1W", ...[...this.getRange(1, 31).map(String)], "LW", "L"],
      monthDaysWithOutLasts: [...[...this.getRange(1, 31).map(String)]],
      hourTypes: ["AM", "PM"]
    };
  }

  private getRange(start: number, end: number): number[] {
    const length = end - start + 1;
    return Array.apply(null, Array(length)).map((_, i) => i + start);
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
