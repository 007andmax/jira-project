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

  getDateFromBootstrap(date) {
    const stringDate = `${date.month}/${date.day}/${date.year}`;
    return moment(stringDate).valueOf();
  }

  public getFormatDate(date) {
    return moment(date).format('MM/DD/YYYY');
  }

  public getFormatToFilterDate(date) {
    return moment(date).format('MM dd YYYY');
  }

  public getInvoiceDate(date) {
    return moment(date).format('DD MMM YYYY');
  }

}
