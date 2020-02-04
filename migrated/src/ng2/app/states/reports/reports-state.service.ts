import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReportsStateService {
glNumber:EventEmitter<any> = new EventEmitter();
  constructor() { }

  public onGetGlNumber(data) {
    this.glNumber.emit(data);
  } 
}