import { Injectable } from '@angular/core';
import * as moment from "moment";

/**
 * Date service to work with date data
 */
@Injectable({
  providedIn: 'root'
})
export class DateService {

  /**
   * Date service constructor
   */
  public constructor() { }

  /**
   * Get start date object
   */
  public getStartDate(date) {
    const dateTime = moment(date);
    return ({
      month: parseInt(dateTime.format('M')),
      year: parseInt(dateTime.format('YYYY')),
      day: parseInt(dateTime.format('D'))
    });
  }

  /**
   * Get date from bootstrap format
   */
  public getDateFromBootstrap(date) {
    const stringDate = `${date.month}/${date.day}/${date.year}`;
     
    return moment(stringDate).valueOf();
  }

  /**
   * Get date in MM/DD/YYYY format
   */
  public getFormatDate(date) {
    return moment(date).format('MM/DD/YYYY');
  }

  /**
   * Get date in MM dd YYYY format
   */
  public getFormatToFilterDate(date) {
    return moment(date).format('MM dd YYYY');
  }

  /**
   * Get date in MM DD YYYY format
   */
  public getInvoiceDate(date) {
    return moment(date).format('DD MMM YYYY');
  }

  /**
   * Get date ms
   */
  public getMs(date) {
    return moment(date).valueOf();
  }

}
