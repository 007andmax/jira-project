import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';

@Injectable()
export class IntervalService {
  sub:Subscription = new Subscription();
  constructor() { }
  public getDefaultOptions() {
    return  {
      formInputClass: 'form-control cron-editor-input',
      formSelectClass: 'form-control cron-editor-select',
      formRadioClass: 'cron-editor-radio',
      formCheckboxClass: 'cron-editor-checkbox',
  
      defaultTime: "00:00:00",
  
      hideMinutesTab: false,
      hideHourlyTab: false,
      hideDailyTab: false,
      hideWeeklyTab: false,
      hideMonthlyTab: false,
      hideYearlyTab: false,
      hideAdvancedTab: false,
      hideSpecificWeekDayTab : false,
      hideSpecificMonthWeekTab : false,
  
      use24HourTime: true,
      hideSeconds: false,
  
      cronFlavor: "quartz"
    };
  }
  public addSubscription(item) {
    this.sub.add(item);
  }
  public clearSubscriptions () {
    this.sub.unsubscribe();
  }
  
}
