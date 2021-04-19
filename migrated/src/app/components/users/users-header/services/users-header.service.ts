import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';

@Injectable()
export class UsersHeaderService {
  sub:Subscription = new Subscription();
  constructor() { }
  public addSubscription (data) {
    this.sub.add(data);
   
  }
  public onUnsubscribe () {
    this.sub.unsubscribe();
  }
}
