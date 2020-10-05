import { Injectable } from '@angular/core';

@Injectable()
export class ContractsListService {

  constructor() { }
  public compareDateNowWithDate(date) {
    let d = new Date(date);
    let t = d.getTime();
    let now = Date.now();
    return (now > t);
  }
  public isShowNotificationReview(review) {
    let current = new Date();
    current.setHours(0);
    current.setMinutes(0);
    current.setSeconds(0);
    current.setMilliseconds(0);
    let reviewDate = new Date(review);
    reviewDate.setHours(0);
    reviewDate.setMinutes(0);
    reviewDate.setSeconds(0);
    reviewDate.setMilliseconds(0);
    return (current.getTime() > reviewDate.getTime() && (current.getTime() - reviewDate.getTime()) < (30 * 86400000));

  }
}
