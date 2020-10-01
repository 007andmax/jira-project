import { Injectable } from '@angular/core';

@Injectable( )
export class ContractsListService {

  constructor() { }
  public compareDateNowWithDate(date) {
    let d = new Date(date);
    let t = d.getTime();
    let now = Date.now();
    return (now > t);
  }
}
