import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs-compat';

@Injectable()
export class UserListService {
  blockList: boolean = false;
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
  /**
   * @description Set new value field "blockList"
   * @param  {boolean} data  - new value "blockList"
   */
  public setBlockList(data) {
    this.blockList = data;
  }
  /**
   * @description Return value field "blockList"
   */
  public getBlockList() {
    return this.blockList;
  }
}
