import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppStateService {
  onChangeDetectorRef: EventEmitter<any> = new EventEmitter();
  isServerError: boolean = false;
  isCustomeError: boolean = false;
  isShowError: boolean = true;
  customeError: string;
  constructor() { }

  public changeDetectorRef() {
    this.onChangeDetectorRef.emit(null);
  }
  public setIsShowError(data) {
    this.isShowError = data;
  }
  public setServerError(data) {
    this.isServerError = data;
  }
  public setCustomeError(data, error = null) {
    this.customeError = error;
    this.isCustomeError = data;
  }
}
