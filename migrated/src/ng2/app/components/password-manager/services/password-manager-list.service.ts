import { Injectable } from '@angular/core';

@Injectable()
export class PasswordManagerListService {

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
}
