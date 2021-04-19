import { Injectable } from '@angular/core';

@Injectable()
export class InvoicesListService {
  blockList: boolean = false;
  constructor() { }
  public setBlockList(data) {
    this.blockList = data;
  }
  public getBlockList() {
    return this.blockList;
  }
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
