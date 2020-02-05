import { Injectable, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class DatePickerService {
  sub: Subscription = new Subscription();
  constructor(  private elRef: ElementRef,) { }

  /**
   * Get date
   * @param date - date
   */
  public getNavDate(date: Date) {
    return {
      next: {
        year: date.getFullYear(),
        month: date.getMonth() + 1
      }
    };
  }

  /**
   * Set text to input
   * @param id - id
   * @param val - val
   */
  public setTextInput(id, val) {
    this.elRef.nativeElement.querySelector(`#${id}`).value = val;
  }

   /**
   * Get date for date picker
   * @param time - milisecongs
   */
  public getDateForDatePicker(time) {
    let date = (time) ? new Date(time) : new Date();
    return new NgbDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
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
   * Set subscription
   * @param data - subscription
   */
  public addSubscription(data) {
    this.sub.add(data);
  }

  /**
   * Clear subscription
   */
  public clearSubscriptions() {
    this.sub.unsubscribe();
  }
}
