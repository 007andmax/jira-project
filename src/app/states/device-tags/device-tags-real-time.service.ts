import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DeviceTagsRealTimeService {
  public changeTagsrray: EventEmitter<any> = new EventEmitter();

  /**
   * Device Tags real time service constructor
   */
  constructor() { }

  /**
   * Handle quote real time changes
   * @newChange - new quotes array changes
   */
  public handleRealTimeChanges(newChange) {
    this.changeTagsrray.emit(newChange);
  }
}
