import { Injectable } from '@angular/core';

@Injectable()
export class RecurringTicketsListService {

  constructor() { }

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
  //  return direction_c;

  }
}
