import { Injectable } from '@angular/core';
import * as moment from "moment";

@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor() { }

  public getStartDate(date) {
    const dateTime = moment(date);
    return ({
      month: parseInt(dateTime.format('M')),
      year: parseInt(dateTime.format('YYYY')),
      day: parseInt(dateTime.format('D'))
    });
  }

  public getMsTime(date) {
    return
  }

}
