import { Injectable, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class DatePickerService {
  sub: Subscription = new Subscription();
  constructor(  private elRef: ElementRef,) { }
  public getNavDate(date: Date) {
    return {
      next: {
        year: date.getFullYear(),
        month: date.getMonth() + 1
      }
    };
  }
  public setTextInput(id, val) {
    this.elRef.nativeElement.querySelector(`#${id}`).value = val;
  }
  public getDateForDatePicker(time) {
    let date = (time) ? new Date(time) : new Date();
    return new NgbDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
  }
  public updateMonthAndYearDatePicker(datepicker, navDate) {
    datepicker.month = navDate.next.month;
    datepicker.year = navDate.next.year;
  }
  public addSubscription(data) {
    this.sub.add(data);
  }
  public clearSubscriptions() {
    this.sub.unsubscribe();
  }
}
