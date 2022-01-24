import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WebsocketStateService {
  isConnected: boolean = false;
  onConnected: EventEmitter<any> = new EventEmitter();
  constructor() { }

  public initConnection() {
    this.isConnected = true;
    this.onConnected.emit(true);
  }
  public getIsConnected() {
    return this.isConnected;
  }
}
