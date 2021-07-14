import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppStateService {
  onChangeDetectorRef: EventEmitter<any> = new EventEmitter();
  constructor() { }

  public changeDetectorRef() {
    this.onChangeDetectorRef.emit(null);
  }
}
