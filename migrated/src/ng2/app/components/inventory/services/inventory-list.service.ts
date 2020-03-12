import { Injectable } from '@angular/core';

@Injectable()
export class InventoryListService {

  blockList:boolean = false;
  constructor() { }
  public setBlockList (data) {
    this.blockList = data;
  }
  public getBlockList () {
    return this.blockList;
  }
}
