import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageCropperStateService {
  onConfirm: EventEmitter<any> = new EventEmitter();
  constructor() { }
  public setConfirm(data) {
    this.onConfirm.emit(data);
  }
  public getConfirm () {
    return this.onConfirm;
  }
 
}
