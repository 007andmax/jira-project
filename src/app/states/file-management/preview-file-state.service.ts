import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PreviewFileStateService {

  onPreview: EventEmitter<any> = new EventEmitter();
  constructor() { }


  public initPreview(data: any) {
    this.onPreview.emit(data);
  }


}
