import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppStateService {
  onChangeDetectorRef: EventEmitter<any> = new EventEmitter();
  isServerError: boolean = false;
  isCustomeError: boolean = false;
  customeError: string;
  constructor() { }

  public changeDetectorRef() {
    this.onChangeDetectorRef.emit(null);
  }
  public setServerError(data) {
    this.isServerError = data;
  }
  public setCustomeError(data, error = null) {
    this.customeError = error;
    this.isCustomeError = data;
  }
}
