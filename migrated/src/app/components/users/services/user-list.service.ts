import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';

@Injectable()
export class UserListService {
  blockList: boolean = false;
  sub: Subscription = new Subscription();
  constructor() { }
  public addSubscription(data) {
    this.sub.add(data);

  }
  public onUnsubscribe() {
    this.sub.unsubscribe();
  }
  public setBlockList(data) {
    this.blockList = data;
  }
  public getBlockList() {
    return this.blockList;
  }
}
