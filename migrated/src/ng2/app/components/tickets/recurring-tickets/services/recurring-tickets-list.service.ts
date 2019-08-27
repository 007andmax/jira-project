import { Injectable } from '@angular/core';

@Injectable()
export class RecurringTicketsListService {
blockList:boolean = false;

  constructor() { }

   /**
   * Get direction
   * @param direction - direction
   * @param sort_c - current sort
   * @param sort_o - old sort
   */
  public getDirection (direction,sort_c,sort_o) {
    if (sort_c === sort_o)
    {
      direction = (direction === 'ASC') ? 'DESC' : 'ASC';
    }
    if (sort_c !== sort_o)
    {
      direction = 'ASC';
    }
    return direction;
  }

   /**
   * Get block list
   */
  public getBlockList() {
    return this.blockList;
  }

    /**
   * Set block list
   * @param val - block list
   */
  public setBlockList (val) {
    return this.blockList = val;
  }
}
