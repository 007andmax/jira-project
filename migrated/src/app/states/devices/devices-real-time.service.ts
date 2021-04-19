import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DevicesRealTimeService {

  public changeDevicesArray: EventEmitter<any> = new EventEmitter();
  public netScanArray: EventEmitter<any> = new EventEmitter();
  public oneTimeConnectionArray: EventEmitter<any> = new EventEmitter();

  /**
   * Quote real time service constructor
   */
  constructor() { }

  /**
   * Handle quote real time changes
   * @newChange - new quotes array changes
   */
  public handleRealTimeChanges(newChange) {
    this.changeDevicesArray.emit(newChange);
  }
  public handleRealTimeNetScan(newChange) {
    this.netScanArray.emit(newChange);
  }
  public handleRealTimeOneTimeConnection(newChange) {
    this.oneTimeConnectionArray.emit(newChange);
  }
}
