import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';

@Injectable()
export class DurationService {
  sub = new Subscription();
  constructor() { }
  public parse (val) {
    return {name:`${val >= 10 ? val : '0' + val}`,value: val};;
  }
  public addSubscription (sub) {
    this.sub.add(sub);
  }
  public clearSubscription () {
    this.sub.unsubscribe();
  }
 
}
