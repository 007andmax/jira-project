import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';

@Injectable()
export class UsersAsideService {
  sub: Subscription = new Subscription();
  constructor() { }
  /**
    * @description Add new element to Array "sub"
    * @param  {Observable} data  - value of "Observable"
    */
  public addSubscription(data) {
    this.sub.add(data);

  }
  /**
  * @description Init logic unsubscribe field "sub"
  */
  public onUnsubscribe() {
    this.sub.unsubscribe();
  }
}
