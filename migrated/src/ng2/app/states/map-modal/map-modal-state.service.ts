import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MapModalStateService {

  showMap: EventEmitter<any> = new EventEmitter();
  constructor() { }

  public onSohwMap(data) {
this.showMap.emit(data);
  }
  public getOnShowMap() {
    return this.showMap;
  }
}
