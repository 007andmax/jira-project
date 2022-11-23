import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DeviceSettingStateService {
  onOpenAside: EventEmitter<any> = new EventEmitter();
  constructor() { }

  public openAsige(data) {
    this.onOpenAside.emit(data);
  }
}
