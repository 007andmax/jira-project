import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiKeysRealTimeService {
  public changeApiKeysArray: EventEmitter<any> = new EventEmitter();
  constructor() { }

  public handleRealTimeChanges(newChange) {
    this.changeApiKeysArray.emit(newChange);
  }
}
