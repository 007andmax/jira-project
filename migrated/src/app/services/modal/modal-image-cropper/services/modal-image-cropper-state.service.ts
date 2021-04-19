import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModalImageCropperStateService {
  onOpen: EventEmitter<any> = new EventEmitter();
  constructor() { }

  public onInitOpen(data) {
    this.onOpen.emit(data);
  }
  public getOnOpen() {
    return this.onOpen;
  }
}
