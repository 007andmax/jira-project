import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';

@Injectable()
export class DurationService {
  sub = new Subscription();
  constructor() { }

  /**
  * Parse val to add 0 
  * @param val val
  */
  public parse (val) {
    return {name:`${val >= 10 ? val : '0' + val}`,value: val};;
  }

    /**
 * Add subscribe
 * @param sub subscribe
 */
  public addSubscription (sub) {
    this.sub.add(sub);
  }

   /**
 * Clear subscribe
 */
  public clearSubscription () {
    this.sub.unsubscribe();
  }
 
}
