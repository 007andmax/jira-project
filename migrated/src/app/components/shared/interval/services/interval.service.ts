import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class IntervalService {
  sub: Subscription = new Subscription();
  constructor() { }

   /**
   * Get default state option
   */
  public getDefaultOptions() {
    return {
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
      hideSpecificWeekDayTab: false,
      hideSpecificMonthWeekTab: false,
      use24HourTime: true,
      hideSeconds: false,
      cronFlavor: "quartz"
    };
  }

   /**
   * Add subscription
   * @param item - subscription
   */
  public addSubscription(item) {
    this.sub.add(item);
  }

    /**
   * Clear subscriptions
   */
  public clearSubscriptions() {
    this.sub.unsubscribe();
  }

   /**
   * Get default date
   */
  public geDefaultNavDate() {
    return {
      next: {
        year: 2019,
        month: 7
      }
    };
  }

   /**
   * Get date fro date picker
   * @param day - day
   */
  public getDateForDatePicker(day) {
    return new NgbDate(2019, 7, day);
  }

    /**
   * Update month after change year
   * @param datepicker - datepicker
   * @param navDate - date
   */
  public updateMonthAndYearDatePicker(datepicker, navDate) {
    datepicker.month = navDate.next.month;
    datepicker.year = navDate.next.year;
  }

  /**
   * Get default state
   */
  public getDefaultState() {
    return {
      daily: {
        MON: true,
        TUE: false,
        WED: false,
        THU: false,
        FRI: false,
        SAT: false,
        SUN: false,

      },
      weekly: {
        MON: false,
        TUE: false,
        WED: false,
        THU: false,
        FRI: false,
        SAT: false,
        SUN: false,
      }
    };
  }

  /**
   * Get short day week
   */
  public getSelectOptions() {
    return {
      days: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
    };
  }

}
